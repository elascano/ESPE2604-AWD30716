import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Link2,
  Download,
  FolderOpen,
  FileSpreadsheet,
  CheckSquare,
  FileCode2,
  History,
  LifeBuoy,
  Users,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Sidebar.css';

interface NavigationItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
}

const userNavigationItems: NavigationItem[] = [
  { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Inicio' },
  { path: '/sri-connection', icon: <Link2 size={20} />, label: 'Conectar SRI' },
  { path: '/invoices/download', icon: <Download size={20} />, label: 'Descargar Facturas' },
  { path: '/invoices/manage', icon: <FolderOpen size={20} />, label: 'Gestionar Facturas' },
  { path: '/ats/generate', icon: <FileSpreadsheet size={20} />, label: 'Generar ATS XLSM' },
  { path: '/ats/validate', icon: <CheckSquare size={20} />, label: 'Validar ATS' },
  { path: '/ats/export', icon: <FileCode2 size={20} />, label: 'Exportar XML' },
  { path: '/traceability', icon: <History size={20} />, label: 'Trazabilidad' },
  { path: '/support', icon: <LifeBuoy size={20} />, label: 'Soporte' },
];

const adminNavigationItems: NavigationItem[] = [
  { path: '/admin/dashboard', icon: <ShieldCheck size={20} />, label: 'Panel Admin', adminOnly: true },
  { path: '/admin/users', icon: <Users size={20} />, label: 'Usuarios', adminOnly: true },
  { path: '/admin/audit', icon: <History size={20} />, label: 'Auditoría', adminOnly: true },
  { path: '/admin/settings', icon: <Settings size={20} />, label: 'Configuración', adminOnly: true },
];

export default function Sidebar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith('/admin');

  const navigationItems = currentUser?.role === 'admin'
    ? (isAdminSection ? adminNavigationItems : userNavigationItems)
    : userNavigationItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M6 8h20M6 14h16M6 20h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="25" cy="22" r="5" fill="#10B981"/>
            <path d="M23 22l1.5 1.5L27 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="sidebar-brand-name">ATS Express</span>
      </div>

      {currentUser?.role === 'admin' && (
        <div className="sidebar-role-toggle">
          <NavLink to="/dashboard" className={({ isActive: _isActive }) => `role-tab ${!isAdminSection ? 'active' : ''}`}>
            Usuario
          </NavLink>
          <NavLink to="/admin/dashboard" className={({ isActive: _isActive }) => `role-tab ${isAdminSection ? 'active' : ''}`}>
            Admin
          </NavLink>
        </div>
      )}

      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-plan">
          <span className="plan-label">Plan Profesional</span>
          <span className="plan-detail">5 empresas activas</span>
        </div>
      </div>
    </aside>
  );
}
