import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { maintenanceCategories, priorityLevels, frequencyOptions, taskTypes, areaCategories } from '../data/defaultData';
import { format, differenceInDays, startOfDay, addDays } from 'date-fns';
import {
  Plus,
  Search,
  Filter,
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
    completeMaintenanceTask
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Read filter and task from URL query params
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) {
      setStatusFilter(filter);
      setTypeFilter('all');
    }

    const taskId = searchParams.get('task');
    if (taskId) {
      const task = maintenanceTasks.find(t => t.id === taskId);
      if (task) {
        setShowEditModal(task);
      }
    }
  }, [searchParams, maintenanceTasks]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);

  const today = startOfDay(new Date());

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return maintenanceTasks
      .filter(task => {
        if (!task.isActive) return false;

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!task.name.toLowerCase().includes(query) &&
              !task.description?.toLowerCase().includes(query) &&
              !task.category.toLowerCase().includes(query) &&
              !task.location?.toLowerCase().includes(query)) {
            return false;
          }
        }

        // Category filter
        if (categoryFilter !== 'All' && task.category !== categoryFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
          return false;
        }

        // Task type filter
        if (typeFilter !== 'all' && task.taskType !== typeFilter) {
          return false;
        }

        // Status filter
        if (task.frequency === 'one-time') {
          // One-time tasks don't have due date status in the same way
          if (statusFilter === 'overdue' || statusFilter === 'due-soon') return false;
          if (statusFilter === 'upcoming') return true;
        } else {
          const dueDate = startOfDay(new Date(task.dueDate));
          const daysUntilDue = differenceInDays(dueDate, today);

          if (statusFilter === 'overdue' && daysUntilDue >= 0) return false;
          if (statusFilter === 'due-soon' && (daysUntilDue < 0 || daysUntilDue > 7)) return false;
          if (statusFilter === 'upcoming' && daysUntilDue <= 7) return false;
        }

        // Area filter - match based on location
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

        // Date filter
        if (dateFilter !== 'all' && task.frequency !== 'one-time') {
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
        // Sort one-time tasks by priority, recurring by due date
        if (a.frequency === 'one-time' && b.frequency === 'one-time') {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (a.frequency === 'one-time') return 1;
        if (b.frequency === 'one-time') return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  }, [maintenanceTasks, searchQuery, categoryFilter, priorityFilter, statusFilter, typeFilter, areaFilter, dateFilter, today]);

  const getTaskStatus = (task) => {
    if (task.frequency === 'one-time') {
      // One-time tasks can have an optional scheduled date
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

  // Stats
  const stats = useMemo(() => {
    const activeTasks = maintenanceTasks.filter(t => t.isActive);
    const recurringTasks = activeTasks.filter(t => t.frequency !== 'one-time');
    const repairTasks = activeTasks.filter(t => t.taskType === 'repair');
    const maintenanceTasks2 = activeTasks.filter(t => t.taskType === 'maintenance');
    const upgradeTasks = activeTasks.filter(t => t.taskType === 'upgrade');

    return {
      total: activeTasks.length,
      overdue: recurringTasks.filter(t => differenceInDays(startOfDay(new Date(t.dueDate)), today) < 0).length,
      dueSoon: recurringTasks.filter(t => {
        const days = differenceInDays(startOfDay(new Date(t.dueDate)), today);
        return days >= 0 && days <= 7;
      }).length,
      repairs: repairTasks.length,
      maintenance: maintenanceTasks2.length,
      upgrades: upgradeTasks.length
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
          <p className="page-subtitle">Keep your home in top shape with scheduled tasks</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="maintenance-stats">
        <button
          className={`stat-pill ${statusFilter === 'all' && typeFilter === 'all' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('all'); setTypeFilter('all'); }}
        >
          <span className="stat-count">{stats.total}</span>
          <span className="stat-label">All Tasks</span>
        </button>
        <button
          className={`stat-pill overdue ${statusFilter === 'overdue' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('overdue'); setTypeFilter('all'); }}
        >
          <AlertTriangle size={16} />
          <span className="stat-count">{stats.overdue}</span>
          <span className="stat-label">Overdue</span>
        </button>
        <button
          className={`stat-pill due-soon ${statusFilter === 'due-soon' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('due-soon'); setTypeFilter('all'); }}
        >
          <Clock size={16} />
          <span className="stat-count">{stats.dueSoon}</span>
          <span className="stat-label">Due Soon</span>
        </button>
        <button
          className={`stat-pill repair ${typeFilter === 'repair' ? 'active' : ''}`}
          onClick={() => { setTypeFilter('repair'); setStatusFilter('all'); }}
        >
          <Hammer size={16} />
          <span className="stat-count">{stats.repairs}</span>
          <span className="stat-label">Repairs</span>
        </button>
        <button
          className={`stat-pill maintenance ${typeFilter === 'maintenance' ? 'active' : ''}`}
          onClick={() => { setTypeFilter('maintenance'); setStatusFilter('all'); }}
        >
          <Wrench size={16} />
          <span className="stat-count">{stats.maintenance}</span>
          <span className="stat-label">Maintenance</span>
        </button>
        <button
          className={`stat-pill upgrade ${typeFilter === 'upgrade' ? 'active' : ''}`}
          onClick={() => { setTypeFilter('upgrade'); setStatusFilter('all'); }}
        >
          <TrendingUp size={16} />
          <span className="stat-count">{stats.upgrades}</span>
          <span className="stat-label">Upgrades</span>
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={16} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            {maintenanceCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            {priorityLevels.map(p => (
              <option key={p.value} value={p.value}>{p.label} Priority</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <MapPin size={16} />
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="filter-select"
          >
            {areaCategories.map(area => (
              <option key={area.value} value={area.value}>{area.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <CalendarDays size={16} />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Due Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="task-list-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={48} />
            <h3>No tasks found</h3>
            <p>
              {searchQuery || categoryFilter !== 'All' || priorityFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Add a maintenance task to get started'}
            </p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map(task => {
              const taskStatus = getTaskStatus(task);

              return (
                <div
                  key={task.id}
                  className={`task-card ${taskStatus.status} clickable`}
                  onClick={() => setShowEditModal(task)}
                >
                  <div className="task-icon-wrapper">
                    <div className={`task-type-icon ${task.taskType}`}>
                      {task.taskType === 'repair' ? <Hammer size={20} /> :
                       task.taskType === 'upgrade' ? <TrendingUp size={20} /> : <Wrench size={20} />}
                    </div>
                  </div>

                  <div className="task-main">
                    <div className="task-header">
                      <h3 className="task-name">{task.name}</h3>
                      <div className="task-badges">
                        <span className={`type-badge ${task.taskType}`}>
                          {task.taskType === 'repair' ? 'Repair' : task.taskType === 'upgrade' ? 'Upgrade' : 'Maintenance'}
                        </span>
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="category-badge">
                          {getCategoryIcon(task.category)}
                          {task.category}
                        </span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}

                    <div className="task-meta">
                      <span className={`due-status ${taskStatus.color}`}>
                        <Calendar size={14} />
                        {taskStatus.label}
                      </span>
                      <span className="frequency">
                        {frequencyOptions.find(f => f.value === task.frequency)?.label || task.frequency}
                      </span>
                      {task.location && (
                        <span className="location">
                          <MapPin size={14} />
                          {task.location}
                        </span>
                      )}
                      {task.estimatedCost > 0 && (
                        <span className="estimated-cost">
                          <DollarSign size={14} />
                          {task.estimatedCost.toLocaleString()}
                        </span>
                      )}
                      {task.contractor && (
                        <span className="contractor-badge">
                          <User size={14} />
                          Contractor
                        </span>
                      )}
                      {task.completionHistory?.length > 0 && (
                        <button
                          className="history-btn"
                          onClick={() => setShowHistoryModal(task)}
                        >
                          <History size={14} />
                          {task.completionHistory.length} completions
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                    {task.frequency !== 'one-time' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setShowCompleteModal(task)}
                      >
                        <CheckCircle2 size={16} />
                        Complete
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => deleteMaintenanceTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <TaskModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSave={addMaintenanceTask}
        />
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <TaskModal
          mode="edit"
          task={showEditModal}
          onClose={() => setShowEditModal(null)}
          onSave={(updates) => {
            updateMaintenanceTask(showEditModal.id, updates);
            setShowEditModal(null);
          }}
        />
      )}

      {/* Complete Task Modal */}
      {showCompleteModal && (
        <CompleteTaskModal
          task={showCompleteModal}
          onClose={() => setShowCompleteModal(null)}
          onComplete={completeMaintenanceTask}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <HistoryModal
          task={showHistoryModal}
          onClose={() => setShowHistoryModal(null)}
        />
      )}
    </div>
  );
}

// Add/Edit Task Modal
function TaskModal({ mode, task, onClose, onSave }) {
  const [name, setName] = useState(task?.name || '');
  const [description, setDescription] = useState(task?.description || '');
  const [category, setCategory] = useState(task?.category || 'HVAC');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [frequency, setFrequency] = useState(task?.frequency || 'monthly');
  const [customDays, setCustomDays] = useState(task?.intervalDays?.toString() || '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [taskType, setTaskType] = useState(task?.taskType || 'maintenance');
  const [location, setLocation] = useState(task?.location || '');
  const [estimatedCost, setEstimatedCost] = useState(task?.estimatedCost?.toString() || '');
  const [contractor, setContractor] = useState(task?.contractor || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const freq = frequencyOptions.find(f => f.value === frequency);
    const intervalDays = frequency === 'custom' ? parseInt(customDays) : (freq?.days || 0);

    const taskData = {
      name,
      description,
      category,
      priority,
      frequency,
      intervalDays,
      taskType,
      location,
      estimatedCost: parseFloat(estimatedCost) || 0,
      contractor,
      ...(dueDate && { dueDate: new Date(dueDate).toISOString() })
    };

    onSave(taskData);
    if (mode === 'add') onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === 'add' ? 'Add Task' : 'Edit Task'}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Replace HVAC Filter"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Add details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Task Type</label>
                <select
                  className="form-select"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                >
                  {taskTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {maintenanceCategories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {priorityLevels.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Frequency</label>
                <select
                  className="form-select"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  {frequencyOptions.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {frequency === 'custom' && (
              <div className="form-group">
                <label className="form-label">Days Between</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g., 45"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  min="1"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {frequency === 'one-time' ? 'Scheduled Date (optional)' : 'Due Date'}
              </label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              {frequency === 'one-time' && (
                <span className="form-hint">Leave blank if not scheduled yet</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Basement - Electrical Room"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Estimated Cost ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Requires Contractor?</label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={contractor}
                    onChange={(e) => setContractor(e.target.checked)}
                  />
                  <span>Yes, needs professional help</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {mode === 'add' ? 'Add Task' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Complete Task Modal
function CompleteTaskModal({ task, onClose, onComplete }) {
  const [notes, setNotes] = useState('');

  const handleComplete = () => {
    onComplete(task.id, notes);
    onClose();
  };

  const nextDueDate = addDays(new Date(), task.intervalDays);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Complete Task</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="complete-task-info">
            <h4>{task.name}</h4>
            <p>Mark this task as complete. It will be automatically rescheduled for:</p>
            <div className="next-due">
              <Calendar size={18} />
              <span>{format(nextDueDate, 'MMMM d, yyyy')}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Completion Notes (optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Add any notes about this completion..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-secondary" onClick={handleComplete}>
            <CheckCircle2 size={16} />
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
}

// History Modal
function HistoryModal({ task, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Completion History</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <h4 className="history-task-name">{task.name}</h4>

          {task.completionHistory.length === 0 ? (
            <p className="text-muted">No completion history yet.</p>
          ) : (
            <div className="history-list">
              {[...task.completionHistory].reverse().map((entry, index) => (
                <div key={entry.id || index} className="history-item">
                  <div className="history-date">
                    <CheckCircle2 size={16} />
                    {format(new Date(entry.completedAt), 'MMM d, yyyy \'at\' h:mm a')}
                  </div>
                  {entry.notes && (
                    <p className="history-notes">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
