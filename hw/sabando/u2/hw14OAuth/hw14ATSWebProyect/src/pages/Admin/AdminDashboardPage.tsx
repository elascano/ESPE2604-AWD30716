import { Users, FileText, AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { MockAuditEvents } from '../../data/mockData';
import '../../styles/Dashboard.css';

interface AdminStat {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
  color: string;
}

const ADMIN_STATS: AdminStat[] = [
  { icon: <Users size={24} />, value: '47', label: 'Usuarios activos', change: '+3 este mes', color: 'blue' },
  { icon: <FileText size={24} />, value: '1,247', label: 'Facturas procesadas', change: '+12% vs mes anterior', color: 'green' },
  { icon: <AlertTriangle size={24} />, value: '8', label: 'Errores reportados', change: '-2 vs semana anterior', color: 'orange' },
  { icon: <TrendingUp size={24} />, value: '99.8%', label: 'Disponibilidad del sistema', change: 'Último mes', color: 'purple' },
];

export default function AdminDashboardPage() {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="admin-header-badge">
          <Shield size={16} />
          <span>Panel de Administración</span>
        </div>
        <h1 className="page-title">Dashboard Administrativo</h1>
        <p className="page-subtitle">Monitoreo general del sistema ATS Express y gestión de usuarios</p>

        <div className="admin-stats-grid mb-24">
          {ADMIN_STATS.map((stat) => (
            <div key={stat.label} className={`admin-stat-card admin-stat-${stat.color}`}>
              <div className={`admin-stat-icon admin-stat-icon-${stat.color}`}>
                {stat.icon}
              </div>
              <div className="admin-stat-body">
                <span className="admin-stat-value">{stat.value}</span>
                <span className="admin-stat-label">{stat.label}</span>
                <span className="admin-stat-change">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-bottom-grid">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-8">
                <Activity size={18} className="text-primary" />
                <h2 className="card-title">Actividad reciente del sistema</h2>
              </div>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Módulo</th>
                    <th>Usuario</th>
                    <th>Detalles</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {MockAuditEvents.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <span className="badge badge-info">{event.action}</span>
                      </td>
                      <td className="text-sm">{event.module}</td>
                      <td className="text-sm text-muted">{event.userId}</td>
                      <td className="text-sm">{event.details}</td>
                      <td className="text-xs text-muted">{new Date(event.timestamp).toLocaleString('es-EC')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Estado de módulos</h2>
              <span className="badge badge-success">Todo operativo</span>
            </div>
            <div className="card-body flex flex-col gap-12">
              {[
                { name: 'Autenticación', status: 'ok', uptime: '100%' },
                { name: 'Integración SRI', status: 'ok', uptime: '99.8%' },
                { name: 'Descarga facturas', status: 'ok', uptime: '99.9%' },
                { name: 'Generación ATS', status: 'warning', uptime: '98.5%' },
                { name: 'Exportación XML', status: 'ok', uptime: '100%' },
                { name: 'Trazabilidad', status: 'ok', uptime: '100%' },
              ].map((module) => (
                <div key={module.name} className="module-status-row">
                  <div className="flex items-center gap-8">
                    <span className={`status-dot status-dot-${module.status === 'ok' ? 'success' : 'warning'}`} />
                    <span className="text-sm font-medium">{module.name}</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-xs text-muted">{module.uptime}</span>
                    <span className={`badge ${module.status === 'ok' ? 'badge-success' : 'badge-warning'}`}>
                      {module.status === 'ok' ? 'Operativo' : 'Alerta'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
