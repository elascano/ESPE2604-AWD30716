import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, Settings, UserCircle, Link2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import '../../styles/Header.css';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { sriConnectionStatus } = useWorkspace();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
        <Link 
          to="/sri-connection" 
          className={`sri-connection-btn sri-connection-${sriConnectionStatus}`}
          title="Conexión con SRI"
        >
          <span className={`status-dot status-dot-${sriConnectionStatus === 'connected' ? 'success' : sriConnectionStatus === 'pending' ? 'warning' : 'danger'}`} />
          <Link2 size={18} />
          <span className="sri-label">SRI</span>
          <span className="sri-status-text">{sriStatusLabel}</span>
        </Link>
      </div>

      <div className="header-right">
        <div className="header-user-wrapper">
          <button
            id="user-menu-toggle"
            className="header-user-btn"
            onClick={() => { setShowUserMenu(!showUserMenu); }}
          >
            <div className="user-avatar">
              {currentUser?.firstName?.[0]}{currentUser?.firstLastName?.[0]}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser?.firstName} {currentUser?.firstLastName}</span>
              <span className="user-role">{currentUser?.isAdmin ? 'Administrador' : 'Contador'}</span>
            </div>
            <ChevronDown size={16} className="text-muted" />
          </button>

          {showUserMenu && (
            <div className="user-dropdown animate-scale-in">
              <div className="user-dropdown-header">
                <div className="user-avatar-lg">
                  {currentUser?.firstName?.[0]}{currentUser?.firstLastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-dark">{currentUser?.firstName} {currentUser?.firstLastName}</p>
                  <p className="text-sm text-muted">{currentUser?.email}</p>
                  <p className="text-xs text-muted">RUC: {currentUser?.RUC}</p>
                </div>
              </div>
              <div className="user-dropdown-divider" />
              <ul className="user-dropdown-list">
                <li>
                  <Link to="/profile" className="user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <UserCircle size={16} /> Mi Perfil
                  </Link>
                </li>
                {currentUser?.isAdmin && (
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
