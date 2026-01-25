import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  Home,
  LayoutGrid,
  Wrench,
  DollarSign,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Users
} from 'lucide-react';
import './Layout.css';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/rooms', icon: LayoutGrid, label: 'Rooms' },
  { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { path: '/costs', icon: DollarSign, label: 'Costs' },
  { path: '/wishlist', icon: ShoppingCart, label: 'Wish List' },
  { path: '/contacts', icon: Users, label: 'Contacts' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { getUnreadCount } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = getUnreadCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <h1 className="mobile-title">Home Hub</h1>
        <Link to="/notifications" className="notification-btn">
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </Link>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Home size={24} />
            </div>
            <span className="logo-text">Home Hub</span>
          </div>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link
            to="/notifications"
            className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Bell size={20} />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="nav-badge">{unreadCount}</span>
            )}
          </Link>
          <Link
            to="/settings"
            className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>

          <div className="user-section">
            <button
              className="user-btn"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="user-avatar">
                <User size={18} />
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-email">{user?.email}</span>
              </div>
              <ChevronDown size={16} className={`chevron ${userMenuOpen ? 'open' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="user-menu">
                <button onClick={handleLogout} className="user-menu-item">
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}
