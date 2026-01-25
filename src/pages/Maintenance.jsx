import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { maintenanceCategories, priorityLevels, frequencyOptions, taskTypes, areaCategories } from '../data/defaultData';
import { format, differenceInDays, startOfDay, addDays } from 'date-fns';
import {
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  History,
  Trash2,
  Edit2,
  Wrench,
  Hammer,
  MapPin,
  DollarSign,
  User,
  Home,
  Droplets,
  Zap,
  Flame,
  Shield,
  Wind,
  TreeDeciduous,
  Building2,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import './Maintenance.css';

// Category icons mapping
const categoryIcons = {
  'HVAC': Wind,
  'Plumbing': Droplets,
  'Electrical': Zap,
  'Exterior': Home,
  'Interior': Building2,
  'Appliances': Wrench,
  'Safety': Shield,
  'Fireplace': Flame,
  'Outdoor': TreeDeciduous,
  'Structure': Building2
};

export default function Maintenance() {
  const [searchParams] = useSearchParams();
  const {
    maintenanceTasks,
    addMaintenanceTask,
    updateMaintenanceTask,
    deleteMaintenanceTask,
    completeMaintenanceTask,
    reopenMaintenanceTask,
    clearCompletedTasks // FIXED: Added this here
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Read filter from URL query params
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) {
      setStatusFilter(filter);
      setTypeFilter('all');
    }
  }, [searchParams]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);

  const today = startOfDay(new Date());

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return maintenanceTasks
      .filter(task => {
        if (!task.isActive && statusFilter !== 'completed') return false;

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!task.name.toLowerCase().includes(query) &&
              !task.description?.toLowerCase().includes(query) &&
              !task.category.toLowerCase().includes(query) &&
              !task.location?.toLowerCase().includes(query)) {
            return false;
          }
        }

        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
        if (typeFilter !== 'all' && task.taskType !== typeFilter) return false;

        if (statusFilter !== 'all') {
          if (statusFilter === 'completed') {
            if (task.isActive) return false;
          } else {
            if (!task.isActive) return false;
            if (!task.dueDate) return false;
            const dueDate = startOfDay(new Date(task.dueDate));
            const daysUntilDue = differenceInDays(dueDate, today);

            if (statusFilter === 'overdue' && daysUntilDue >= 0) return false;
            if (statusFilter === 'due-soon' && (daysUntilDue < 0 || daysUntilDue > 30)) return false;
            if (statusFilter === 'upcoming' && daysUntilDue <= 30) return false;
          }
        }

        if (areaFilter !== 'all') {
          const location = (task.location || '').toLowerCase();
          const areaMatches = {
            'outdoor': location.includes('outside') || location.includes('deck') || location.includes('yard') || location.includes('roof') || location.includes('gutter'),
            'basement': location.includes('basement'),
            'main-floor': location.includes('main floor'),
            'upper-floor': location.includes('upper floor'),
            'attic': location.includes('attic'),
            'structure': task.category === 'Structure' || location.includes('foundation')
          };
          if (!areaMatches[areaFilter]) return false;
        }

        if (dateFilter !== 'all' && task.frequency !== 'one-time') {
          if (!task.dueDate) return false;
          const dueDate = startOfDay(new Date(task.dueDate));
          const daysUntilDue = differenceInDays(dueDate, today);

          if (dateFilter === 'today' && daysUntilDue !== 0) return false;
          if (dateFilter === 'this-week' && (daysUntilDue < 0 || daysUntilDue > 7)) return false;
          if (dateFilter === 'this-month' && (daysUntilDue < 0 || daysUntilDue > 30)) return false;
          if (dateFilter === 'this-quarter' && (daysUntilDue < 0 || daysUntilDue > 90)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aHasDate = !!a.dueDate;
        const bHasDate = !!b.dueDate;
        if (aHasDate && bHasDate) return new Date(a.dueDate) - new Date(b.dueDate);
        if (aHasDate && !bHasDate) return -1;
        if (!aHasDate && bHasDate) return 1;
        return 0;
      });
  }, [maintenanceTasks, searchQuery, priorityFilter, statusFilter, typeFilter, areaFilter, dateFilter, today]);

  const getTaskStatus = (task) => {
    if (task.frequency === 'one-time') {
      if (task.dueDate) {
        const due = startOfDay(new Date(task.dueDate));
        const daysUntilDue = differenceInDays(due, today);
        if (daysUntilDue < 0) return { status: 'overdue', label: `${Math.abs(daysUntilDue)} days ago`, color: 'error' };
        if (daysUntilDue === 0) return { status: 'today', label: 'Scheduled Today', color: 'warning' };
        if (daysUntilDue <= 7) return { status: 'soon', label: `Scheduled in ${daysUntilDue} days`, color: 'primary' };
        return { status: 'upcoming', label: `Scheduled ${format(due, 'MMM d')}`, color: 'neutral' };
      }
      return { status: 'one-time', label: 'Not Scheduled', color: 'neutral' };
    }

    const due = startOfDay(new Date(task.dueDate));
    const daysUntilDue = differenceInDays(due, today);

    if (daysUntilDue < 0) return { status: 'overdue', label: `${Math.abs(daysUntilDue)} days overdue`, color: 'error' };
    if (daysUntilDue === 0) return { status: 'today', label: 'Due Today', color: 'warning' };
    if (daysUntilDue <= 7) return { status: 'soon', label: `Due in ${daysUntilDue} days`, color: 'primary' };
    return { status: 'upcoming', label: format(due, 'MMM d, yyyy'), color: 'neutral' };
  };

  const stats = useMemo(() => {
    const activeTasks = maintenanceTasks.filter(t => t.isActive);
    const tasksWithDueDate = activeTasks.filter(t => t.dueDate);
    const totalCompletions = maintenanceTasks.reduce((sum, task) => sum + (task.completionHistory?.length || 0), 0);
    const completedListCount = maintenanceTasks.filter(t => !t.isActive).length;

    return {
      total: activeTasks.length,
      overdue: tasksWithDueDate.filter(t => differenceInDays(startOfDay(new Date(t.dueDate)), today) < 0).length,
      dueSoon: tasksWithDueDate.filter(t => {
        const days = differenceInDays(startOfDay(new Date(t.dueDate)), today);
        return days >= 0 && days <= 30;
      }).length,
      completed: totalCompletions,
      historyCount: completedListCount, // For the Clear History logic
      repairs: activeTasks.filter(t => t.taskType === 'repair').length,
      maintenance: activeTasks.filter(t => t.taskType === 'maintenance').length,
      upgrades: activeTasks.filter(t => t.taskType === 'upgrade').length
    };
  }, [maintenanceTasks, today]);

  const getCategoryIcon = (category) => {
    const IconComponent = categoryIcons[category] || Wrench;
    return <IconComponent size={16} />;
  };

  return (
    <div className="maintenance-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance & Repairs</h1>
          <p className="page-subtitle">Keep your home in top shape</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
          {statusFilter === 'completed' && stats.historyCount > 0 && (
            <button className="btn btn-ghost" onClick={() => {
              if (window.confirm("Clear all completed task history?")) clearCompletedTasks();
            }}>
              <Trash2 size={18} /> Clear Completed
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      <div className="maintenance-stats">
        <button className={`stat-pill ${statusFilter === 'all' && typeFilter === 'all' ? 'active' : ''}`} onClick={() => { setStatusFilter('all'); setTypeFilter('all'); }}>
          <span className="stat-count">{stats.total}</span>
          <span className="stat-label">All Tasks</span>
        </button>
        <button className={`stat-pill overdue ${statusFilter === 'overdue' ? 'active' : ''}`} onClick={() => { setStatusFilter('overdue'); setTypeFilter('all'); }}>
          <AlertTriangle size={16} />
          <span className="stat-count">{stats.overdue}</span>
          <span className="stat-label">Overdue</span>
        </button>
        <button className={`stat-pill due-soon ${statusFilter === 'due-soon' ? 'active' : ''}`} onClick={() => { setStatusFilter('due-soon'); setTypeFilter('all'); }}>
          <Clock size={16} />
          <span className="stat-count">{stats.dueSoon}</span>
          <span className="stat-label">Due Soon</span>
        </button>
        <button className={`stat-pill completed ${statusFilter === 'completed' ? 'active' : ''}`} onClick={() => { setStatusFilter('completed'); setTypeFilter('all'); }}>
          <CheckCircle2 size={16} />
          <span className="stat-count">{stats.historyCount}</span>
          <span className="stat-label">History</span>
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="filter-group">
          <AlertTriangle size={16} />
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="filter-select">
            <option value="all">All Priorities</option>
            {priorityLevels.map(p => <option key={p.value} value={p.value}>{p.label} Priority</option>)}
          </select>
        </div>
        <div className="filter-group">
          <Home size={16} />
          <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="filter-select">
            {areaCategories.map(area => <option key={area.value} value={area.value}>{area.label}</option>)}
          </select>
        </div>
      </div>

      <div className="task-list-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={48} />
            <h3>No tasks found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map(task => {
              const taskStatus = getTaskStatus(task);
              return (
                <div key={task.id} className={`task-card ${taskStatus.status} ${!task.isActive ? 'is-completed' : ''} clickable`} onClick={() => setShowEditModal(task)}>
                  <div className="task-icon-wrapper">
                    <div className={`task-type-icon ${task.taskType}`}>
                      {task.taskType === 'repair' ? <Hammer size={20} /> : task.taskType === 'upgrade' ? <TrendingUp size={20} /> : <Wrench size={20} />}
                    </div>
                  </div>
                  <div className="task-main">
                    <div className="task-header">
                      <h3 className="task-name">{task.name}</h3>
                      <div className="task-badges">
                        <span className={`type-badge ${task.taskType}`}>{task.taskType}</span>
                        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                      </div>
                    </div>
                    {task.description && <p className="task-description">{task.description}</p>}
                    <div className="task-meta">
                      <span className={`due-status ${taskStatus.color}`}><Calendar size={14} />{taskStatus.label}</span>
                      {task.location && <span className="location"><MapPin size={14} />{task.location}</span>}
                    </div>
                  </div>
                  <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                    {task.isActive ? (
                      <button className="btn btn-secondary btn-sm" onClick={() => task.frequency === 'one-time' ? (window.confirm(`Complete ${task.name}?`) && completeMaintenanceTask(task.id)) : setShowCompleteModal(task)}>
                        <CheckCircle2 size={16} /> Complete
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-sm" onClick={() => setShowAddModal({...task, dueDate: ''})}>
                        <History size={16} /> Reopen
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => deleteMaintenanceTask(task.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <TaskModal 
          mode="add" 
          task={typeof showAddModal === 'object' ? showAddModal : null} // FIXED: Properly passing template task
          onClose={() => setShowAddModal(false)} 
          onSave={addMaintenanceTask} 
        />
      )}
      {showEditModal && <TaskModal mode="edit" task={showEditModal} onClose={() => setShowEditModal(null)} onSave={(updates) => { updateMaintenanceTask(showEditModal.id, updates); setShowEditModal(null); }} />}
      {showCompleteModal && <CompleteTaskModal task={showCompleteModal} onClose={() => setShowCompleteModal(null)} onComplete={completeMaintenanceTask} />}
      {showHistoryModal && <HistoryModal task={showHistoryModal} onClose={() => setShowHistoryModal(null)} />}
    </div>
  );
}

function TaskModal({ mode, task, onClose, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('HVAC');
  const [priority, setPriority] = useState('medium');
  const [frequency, setFrequency] = useState('monthly');
  const [customDays, setCustomDays] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taskType, setTaskType] = useState('maintenance');
  const [location, setLocation] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [contractor, setContractor] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name || '');
      setDescription(task.description || '');
      setCategory(task.category || 'HVAC');
      setPriority(task.priority || 'medium');
      setFrequency(task.frequency || 'monthly');
      setCustomDays(task.intervalDays?.toString() || '');
      setDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
      setTaskType(task.taskType || 'maintenance');
      setLocation(task.location || '');
      setEstimatedCost(task.estimatedCost?.toString() || '');
      setContractor(task.contractor || false);
    } else {
      setName(''); setDescription(''); setCategory('HVAC'); setPriority('medium');
      setFrequency('monthly'); setCustomDays(''); setDueDate(''); setTaskType('maintenance');
      setLocation(''); setEstimatedCost(''); setContractor(false);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const freq = frequencyOptions.find(f => f.value === frequency);
    const intervalDays = frequency === 'custom' ? parseInt(customDays) : (freq?.days || 0);

    onSave({
      name, description, category, priority, frequency, intervalDays,
      taskType, location, estimatedCost: parseFloat(estimatedCost) || 0,
      contractor, dueDate: dueDate ? new Date(dueDate).toISOString() : null
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === 'add' ? (task ? 'Reopen Task' : 'Add Task') : 'Edit Task'}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group"><label className="form-label">Task Name *</label><input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Task Type</label>
                <select className="form-select" value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                  {taskTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {maintenanceCategories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required={frequency !== 'one-time'} />
            </div>
            <div className="form-group"><label className="form-label">Location</label><input type="text" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{mode === 'add' ? 'Create Task' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CompleteTaskModal({ task, onClose, onComplete }) {
  const [notes, setNotes] = useState('');
  const handleComplete = () => { onComplete(task.id, notes); onClose(); };
  const nextDueDate = addDays(new Date(), task.intervalDays);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3>Complete Task</h3><button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button></div>
        <div className="modal-body">
          <div className="complete-task-info">
            <h4>{task.name}</h4>
            <p>Rescheduling for: <strong>{format(nextDueDate, 'MMMM d, yyyy')}</strong></p>
          </div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <div className="modal-footer"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-secondary" onClick={handleComplete}>Mark Complete</button></div>
      </div>
    </div>
  );
}

function HistoryModal({ task, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3>History</h3><button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button></div>
        <div className="modal-body">
          {task.completionHistory?.length === 0 ? <p>No history yet.</p> : (
            <div className="history-list">
              {[...task.completionHistory].reverse().map((entry, i) => (
                <div key={i} className="history-item"><strong>{format(new Date(entry.completedAt), 'MMM d, yyyy')}</strong>: {entry.notes}</div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer"><button className="btn btn-primary" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}