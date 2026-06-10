import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, ChevronDown, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Notification } from '../../types';
import '../../styles/Header.css';

export default function Header() {
  const { currentUser, logout, sriConnectionStatus } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications: Notification[] = [
    { id: 'n1', type: 'warning', title: 'Facturas Faltantes', message: '2 facturas del proveedor XYZ no han sido descargadas.', timestamp: 'Hace 1 hora', read: false },
    { id: 'n2', type: 'error', title: 'Inconsistencia en ATS', message: 'La retención M001-001-000040 tiene un error de validación.', timestamp: 'Hace 2 horas', read: false },
    { id: 'n3', type: 'info', title: 'Recordatorio', message: 'El plazo para declarar el ATS vence el 30/11/2025.', timestamp: 'Hace 3 horas', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sriStatusLabel = {
    connected: 'Conectado',
    disconnected: 'Desconectado',
    pending: 'Conectando...',
  }[sriConnectionStatus];

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/sri-connection" className="sri-status-indicator" style={{ cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span className={`status-dot status-dot-${sriConnectionStatus === 'connected' ? 'success' : sriConnectionStatus === 'pending' ? 'warning' : 'danger'} status-dot-pulse`} />
          <span className="sri-status-label">SRI: {sriStatusLabel}</span>
        </Link>
      </div>

      <div className="header-right">
        <div className="header-notification-wrapper">
          <button
            id="notification-bell"
            className="header-icon-btn"
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            aria-label="Notificaciones"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown animate-scale-in">
              <div className="notification-header">
                <span className="font-semibold">Notificaciones</span>
                <span className="badge badge-danger">{unreadCount} nuevas</span>
              </div>
              <ul className="notification-list">
                {notifications.map((notif) => (
                  <li key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                    <div className={`notification-dot status-dot status-dot-${notif.type === 'warning' ? 'warning' : notif.type === 'error' ? 'danger' : 'success'}`} />
                    <div className="notification-content">
                      <p className="notification-title">{notif.title}</p>
                      <p className="notification-message">{notif.message}</p>
                      <p className="notification-time">{notif.timestamp}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="header-user-wrapper">
          <button
            id="user-menu-toggle"
            className="header-user-btn"
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
          >
            <div className="user-avatar">
              {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser?.firstName} {currentUser?.lastName}</span>
              <span className="user-role">{currentUser?.role === 'admin' ? 'Administrador' : 'Contador'}</span>
            </div>
            <ChevronDown size={16} className="text-muted" />
          </button>

          {showUserMenu && (
            <div className="user-dropdown animate-scale-in">
              <div className="user-dropdown-header">
                <div className="user-avatar-lg">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-dark">{currentUser?.firstName} {currentUser?.lastName}</p>
                  <p className="text-sm text-muted">{currentUser?.email}</p>
                  <p className="text-xs text-muted">RUC: {currentUser?.ruc}</p>
                </div>
              </div>
              <div className="user-dropdown-divider" />
              <ul className="user-dropdown-list">
                <li>
                  <Link to="/profile" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <UserCircle size={16} /> Mi Perfil
                  </Link>
                </li>
                {currentUser?.role === 'admin' && (
                  <li>
                    <Link to="/admin/settings" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <Settings size={16} /> Configuración
                    </Link>
                  </li>
                )}
              </ul>
              <div className="user-dropdown-divider" />
              <button id="logout-btn" className="user-logout-btn" onClick={handleLogout}>
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
