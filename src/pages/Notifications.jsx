import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Check
} from 'lucide-react';
import './Notifications.css';

export default function Notifications() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    getUnreadCount
  } = useData();

  const unreadCount = getUnreadCount();

  const getIcon = (type, priority) => {
    if (type === 'due-today') {
      return <AlertTriangle size={20} className="icon-warning" />;
    }
    if (priority === 'high') {
      return <AlertTriangle size={20} className="icon-error" />;
    }
    return <Clock size={20} className="icon-primary" />;
  };

  // Sort by priority (high to low), then by date (newest first)
  const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
  const sortedNotifications = [...notifications].sort((a, b) => {
    const priorityDiff = (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={markAllNotificationsRead}>
            <Check size={16} />
            Mark All Read
          </button>
        )}
      </div>

      <div className="notifications-container">
        {sortedNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={64} />
            <h3>No Notifications</h3>
            <p>You'll receive notifications here when maintenance tasks are due</p>
          </div>
        ) : (
          <div className="notifications-list">
            {sortedNotifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-card ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon">
                  {getIcon(notification.type, notification.priority)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <span className="notification-time">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  {notification.priority && (
                    <span className={`priority-badge priority-${notification.priority}`}>
                      {notification.priority} priority
                    </span>
                  )}
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => markNotificationRead(notification.id)}
                      title="Mark as read"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
