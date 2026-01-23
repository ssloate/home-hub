import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { propertyInfo } from '../data/defaultData';
import {
  User,
  Bell,
  Mail,
  Home,
  Save,
  AlertCircle,
  RefreshCw,
  Database
} from 'lucide-react';
import './Settings.css';

export default function Settings() {
  const { user, updateUser, updateSettings } = useAuth();
  const { resetMaintenanceTasks, maintenanceTasks } = useData();

  const [name, setName] = useState(user?.name || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [emailNotifications, setEmailNotifications] = useState(user?.settings?.emailNotifications ?? true);
  const [notifyWeekBefore, setNotifyWeekBefore] = useState(user?.settings?.notifyWeekBefore ?? true);
  const [notifyOnDueDate, setNotifyOnDueDate] = useState(user?.settings?.notifyOnDueDate ?? true);
  const [gmailUser, setGmailUser] = useState(user?.settings?.gmailUser || '');
  const [gmailAppPassword, setGmailAppPassword] = useState('');

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }

    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    updateSettings({
      emailNotifications,
      notifyWeekBefore,
      notifyOnDueDate,
      gmailUser,
      ...(gmailAppPassword && { gmailAppPassword })
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetTasks = () => {
    resetMaintenanceTasks();
    setShowResetConfirm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and notification preferences</p>
      </div>

      {saved && (
        <div className="success-banner">
          <Save size={18} />
          Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="settings-grid">
        {/* Profile Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <User size={20} />
            <h2>Profile</h2>
          </div>
          <div className="settings-card-body">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSaveProfile}>
              Save Profile
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Bell size={20} />
            <h2>Notifications</h2>
          </div>
          <div className="settings-card-body">
            <div className="setting-row">
              <div className="setting-info">
                <h3>In-App Notifications</h3>
                <p>Receive notifications within the app</p>
              </div>
              <label className="toggle">
                <input type="checkbox" checked disabled />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <h3>One Week Before</h3>
                <p>Get notified one week before a task is due</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifyWeekBefore}
                  onChange={(e) => setNotifyWeekBefore(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <h3>On Due Date</h3>
                <p>Get notified when a task is due</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifyOnDueDate}
                  onChange={(e) => setNotifyOnDueDate(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <button className="btn btn-primary" onClick={handleSaveNotifications}>
              Save Notifications
            </button>
          </div>
        </div>

        {/* Email Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Mail size={20} />
            <h2>Email Notifications</h2>
          </div>
          <div className="settings-card-body">
            <div className="setting-row">
              <div className="setting-info">
                <h3>Enable Email Notifications</h3>
                <p>Receive task reminders via email</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {emailNotifications && (
              <>
                <div className="form-group">
                  <label className="form-label">Gmail Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your.email@gmail.com"
                    value={gmailUser}
                    onChange={(e) => setGmailUser(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gmail App Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter app password (leave blank to keep existing)"
                    value={gmailAppPassword}
                    onChange={(e) => setGmailAppPassword(e.target.value)}
                  />
                  <p className="form-hint">
                    Generate an app password at{' '}
                    <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer">
                      Google Account Settings
                    </a>
                  </p>
                </div>
              </>
            )}

            <button className="btn btn-primary" onClick={handleSaveNotifications}>
              Save Email Settings
            </button>
          </div>
        </div>

        {/* Property Info */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Home size={20} />
            <h2>Property Information</h2>
          </div>
          <div className="settings-card-body">
            <div className="property-info-grid">
              <div className="property-info-item">
                <span className="label">Address</span>
                <span className="value">{propertyInfo.address}</span>
              </div>
              <div className="property-info-item">
                <span className="label">City</span>
                <span className="value">{propertyInfo.city}, {propertyInfo.state} {propertyInfo.zip}</span>
              </div>
              <div className="property-info-item">
                <span className="label">Year Built</span>
                <span className="value">{propertyInfo.yearBuilt}</span>
              </div>
              <div className="property-info-item">
                <span className="label">Square Footage</span>
                <span className="value">{propertyInfo.squareFeet.toLocaleString()} sq ft</span>
              </div>
              <div className="property-info-item">
                <span className="label">Bedrooms / Bathrooms</span>
                <span className="value">{propertyInfo.bedrooms} bed / {propertyInfo.bathrooms} bath</span>
              </div>
              <div className="property-info-item">
                <span className="label">Lot Size</span>
                <span className="value">{propertyInfo.lotSize.toLocaleString()} sq ft</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
