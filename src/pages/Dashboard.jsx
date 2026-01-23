import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { propertyInfo } from '../data/defaultData';
import { format, differenceInDays, startOfDay, isToday, isPast } from 'date-fns';
import {
  Home,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  Calendar,
  TrendingUp,
  Wrench,
  LayoutGrid
} from 'lucide-react';
import { DecorationDots } from '../components/HouseIllustrations';
import houseImage from '../assets/house-icon.png';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    maintenanceTasks,
    costs,
    rooms,
    getUpcomingTasks,
    getOverdueTasks,
    getTotalCosts
  } = useData();

  const today = startOfDay(new Date());

  // Calculate statistics
  const stats = useMemo(() => {
    const overdueTasks = getOverdueTasks();
    const upcomingTasks = getUpcomingTasks();
    const totalTasksCompleted = maintenanceTasks.reduce(
      (sum, task) => sum + task.completionHistory.length, 0
    );

    // This month's costs
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthCosts = costs.filter(c => new Date(c.date) >= startOfMonth);
    const thisMonthTotal = thisMonthCosts.reduce((sum, c) => sum + (c.amount || 0), 0);

    // This year's costs
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const thisYearCosts = costs.filter(c => new Date(c.date) >= startOfYear);
    const thisYearTotal = thisYearCosts.reduce((sum, c) => sum + (c.amount || 0), 0);

    return {
      overdueTasks: overdueTasks.length,
      upcomingTasks: upcomingTasks.length,
      totalTasksCompleted,
      thisMonthTotal,
      thisYearTotal
    };
  }, [maintenanceTasks, costs, getOverdueTasks, getUpcomingTasks, today]);

  // Get next 5 upcoming tasks
  const nextTasks = useMemo(() => {
    return maintenanceTasks
      .filter(task => task.isActive)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [maintenanceTasks]);

  // Get recent costs (last 5)
  const recentCosts = useMemo(() => {
    return [...costs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [costs]);

  const getTaskStatus = (dueDate) => {
    const due = new Date(dueDate);
    if (isPast(due) && !isToday(due)) return 'overdue';
    if (isToday(due)) return 'today';
    const daysUntil = differenceInDays(due, today);
    if (daysUntil <= 7) return 'soon';
    return 'upcoming';
  };

  const formatDueDate = (dueDate) => {
    const due = new Date(dueDate);
    if (isToday(due)) return 'Today';
    const daysUntil = differenceInDays(due, today);
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
    if (daysUntil <= 7) return `In ${daysUntil} days`;
    return format(due, 'MMM d');
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <DecorationDots className="welcome-decoration" />
          <h1>{greeting}, {user?.name?.split(' ')[0]}!</h1>
          <p>Here's what's happening with your home</p>
        </div>
        <div className="welcome-visual">
          <img src={houseImage} alt="Home" className="house-illustration" />
          <div className="property-badge">
            <Home size={18} />
            <span>{propertyInfo.address}, {propertyInfo.city}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Link to="/maintenance?filter=overdue" className="stat-card clickable">
          <div className="stat-icon overdue">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.overdueTasks}</span>
            <span className="stat-label">Overdue Tasks</span>
          </div>
        </Link>

        <Link to="/maintenance?filter=due-soon" className="stat-card clickable">
          <div className="stat-icon upcoming">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.upcomingTasks}</span>
            <span className="stat-label">Tasks This Month</span>
          </div>
        </Link>

        <Link to="/maintenance" className="stat-card clickable">
          <div className="stat-icon completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalTasksCompleted}</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
        </Link>

        <Link to="/costs" className="stat-card clickable">
          <div className="stat-icon costs">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">${stats.thisMonthTotal.toLocaleString()}</span>
            <span className="stat-label">Spent This Month</span>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Upcoming Tasks */}
        <div className="dashboard-card tasks-card">
          <div className="card-header">
            <div className="card-title">
              <Calendar size={20} />
              <h2>Upcoming Tasks</h2>
            </div>
            <Link to="/maintenance" className="card-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card-body">
            {nextTasks.length === 0 ? (
              <div className="empty-state">
                <CheckCircle2 size={40} />
                <p>No upcoming tasks!</p>
              </div>
            ) : (
              <div className="task-list">
                {nextTasks.map(task => {
                  const status = getTaskStatus(task.dueDate);
                  return (
                    <div key={task.id} className={`task-item ${status}`}>
                      <div className="task-info">
                        <span className="task-name">{task.name}</span>
                        <span className="task-category">{task.category}</span>
                      </div>
                      <div className="task-due">
                        <span className={`due-badge ${status}`}>
                          {formatDueDate(task.dueDate)}
                        </span>
                        <span className={`priority-dot priority-${task.priority}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="dashboard-card costs-card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={20} />
              <h2>Recent Expenses</h2>
            </div>
            <Link to="/costs" className="card-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card-body">
            {recentCosts.length === 0 ? (
              <div className="empty-state">
                <DollarSign size={40} />
                <p>No expenses recorded yet</p>
              </div>
            ) : (
              <div className="cost-list">
                {recentCosts.map(cost => (
                  <div key={cost.id} className="cost-item">
                    <div className="cost-info">
                      <span className="cost-name">{cost.description}</span>
                      <span className="cost-category">{cost.category}</span>
                    </div>
                    <div className="cost-amount">
                      <span>${cost.amount?.toLocaleString()}</span>
                      <span className="cost-date">{format(new Date(cost.date), 'MMM d')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card-footer">
            <div className="cost-summary">
              <span>Year to Date</span>
              <span className="cost-total">${stats.thisYearTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="dashboard-card quick-links-card">
          <div className="card-header">
            <div className="card-title">
              <LayoutGrid size={20} />
              <h2>Quick Actions</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="quick-links">
              <Link to="/rooms" className="quick-link">
                <div className="quick-link-icon rooms">
                  <LayoutGrid size={24} />
                </div>
                <span>Browse Rooms</span>
              </Link>
              <Link to="/maintenance" className="quick-link">
                <div className="quick-link-icon maintenance">
                  <Wrench size={24} />
                </div>
                <span>Maintenance</span>
              </Link>
              <Link to="/costs" className="quick-link">
                <div className="quick-link-icon costs">
                  <DollarSign size={24} />
                </div>
                <span>Track Costs</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Property Info */}
        <div className="dashboard-card property-card">
          <div className="card-header">
            <div className="card-title">
              <Home size={20} />
              <h2>Property Details</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="property-details">
              <div className="property-detail">
                <span className="detail-label">Address</span>
                <span className="detail-value">{propertyInfo.address}</span>
              </div>
              <div className="property-detail">
                <span className="detail-label">City</span>
                <span className="detail-value">{propertyInfo.city}, {propertyInfo.state} {propertyInfo.zip}</span>
              </div>
              <div className="property-detail">
                <span className="detail-label">Year Built</span>
                <span className="detail-value">{propertyInfo.yearBuilt}</span>
              </div>
              <div className="property-detail">
                <span className="detail-label">Square Footage</span>
                <span className="detail-value">{propertyInfo.squareFeet.toLocaleString()} sq ft</span>
              </div>
              <div className="property-detail">
                <span className="detail-label">Beds / Baths</span>
                <span className="detail-value">{propertyInfo.bedrooms} bed / {propertyInfo.bathrooms} bath</span>
              </div>
              <div className="property-detail">
                <span className="detail-label">Lot Size</span>
                <span className="detail-value">{propertyInfo.lotSize.toLocaleString()} sq ft</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
