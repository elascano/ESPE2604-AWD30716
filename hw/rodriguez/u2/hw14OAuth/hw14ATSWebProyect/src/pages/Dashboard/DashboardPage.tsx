import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Link2,
  Download,
  FileSpreadsheet,
  FileCode2,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle2,
  TrendingUp,
  FileText,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import type { Notification } from '../../types';
import axios from 'axios';
import '../../styles/Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ActionCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  path: string;
  color: string;
  status?: string;
}

const buildActionCards = (sriConnected: boolean): ActionCard[] => [
  {
    id: 'connect-sri',
    icon: <Link2 size={28} />,
    title: 'Conectar con SRI',
    subtitle: 'Portal web del SRI',
    path: '/sri-connection',
    color: sriConnected ? 'green' : 'blue',
    status: sriConnected ? 'Conectado' : undefined,
  },
  {
    id: 'download-invoices',
    icon: <Download size={28} />,
    title: 'Descargar Facturas',
    subtitle: 'Automático desde SRI',
    path: '/invoices/download',
    color: 'purple',
  },
  {
    id: 'generate-xlsm',
    icon: <FileSpreadsheet size={28} />,
    title: 'Generar ATS XLSM',
    subtitle: 'Archivo Excel Macro',
    path: '/ats/generate',
    color: 'indigo',
  },
  {
    id: 'generate-xml',
    icon: <FileCode2 size={28} />,
    title: 'Generar ATS XML',
    subtitle: 'Listo para declarar',
    path: '/ats/export',
    color: 'teal',
  },
];

function NotificationIcon({ type }: { type: Notification['type'] }) {
  const props = { size: 16 };
  if (type === 'warning') return <AlertTriangle {...props} />;
  if (type === 'error') return <XCircle {...props} />;
  if (type === 'success') return <CheckCircle2 {...props} />;
  return <Info {...props} />;
}

export default function DashboardPage() {
  const { sriConnectionStatus, currentUser } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [summary, setSummary] = useState({
    invoicesDownloaded: 0,
    invoicesDownloadedChange: 0,
    errorsDetected: 0,
    lastSync: 'No sincronizado',
    notifications: [] as Notification[]
  });

  useEffect(() => {
    if (currentUser?.id) {
      axios.get(`${API_URL}/dashboard/${currentUser.id}`)
        .then(response => {
          if (response.data.success) {
            setSummary(response.data.data);
          }
        })
        .catch(error => console.error("Error fetching dashboard data:", error));
    }
  }, [currentUser]);

  const actionCards = buildActionCards(sriConnectionStatus === 'connected');

  const handleSync = async () => {
    setIsSyncing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Bienvenido a ATS Express</h1>
        <p className="page-subtitle">
          Automatiza la descarga de facturas del SRI y genera tu Anexo Transaccional Simplificado
        </p>

        <section className="card mb-24">
          <div className="card-header">
            <h2 className="card-title">Acciones Principales</h2>
          </div>
          <div className="card-body">
            <div className="action-cards-grid">
              {actionCards.map((action) => (
                <Link
                  key={action.id}
                  id={action.id}
                  to={action.path}
                  className={`action-card action-card-${action.color}`}
                >
                  <div className={`action-card-icon action-icon-${action.color}`}>
                    {action.icon}
                  </div>
                  <p className="action-card-title">{action.title}</p>
                  <p className="action-card-subtitle">{action.subtitle}</p>
                  {action.status && (
                    <span className="badge badge-success action-card-badge">{action.status}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="dashboard-bottom-grid">
          <div className="dashboard-summary-col">
            <div className="card mb-24">
              <div className="card-header">
                <h2 className="card-title">Resumen del Período Fiscal Actual</h2>
                <span className="badge badge-info">Noviembre 2025</span>
              </div>
              <div className="card-body">
                <div className="summary-cards">
                  <div className="summary-stat-card blue">
                    <div className="stat-card-icon">
                      <FileText size={24} />
                    </div>
                    <div className="stat-card-body">
                      <span className="stat-card-value">{summary.invoicesDownloaded}</span>
                      <span className="stat-card-label">Facturas Descargadas</span>
                      <span className="stat-card-sub">Este mes (Noviembre 2025)</span>
                      <span className="stat-card-change positive">
                        <TrendingUp size={12} /> +{summary.invoicesDownloadedChange}% vs mes anterior
                      </span>
                    </div>
                  </div>

                  <div className="summary-stat-card orange">
                    <div className="stat-card-icon">
                      <AlertTriangle size={24} />
                    </div>
                    <div className="stat-card-body">
                      <span className="stat-card-value">{summary.errorsDetected}</span>
                      <span className="stat-card-label">Errores Detectados</span>
                      <span className="stat-card-sub">Requieren atención</span>
                      <Link to="/ats/validate" className="stat-card-link">
                        Pendientes de corrección →
                      </Link>
                    </div>
                  </div>

                  <div className="summary-stat-card green full-width">
                    <div className="stat-card-icon">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-card-body">
                      <span className="stat-card-label">ATS Listo para Generar</span>
                      <span className="stat-card-sub">Período actual completo</span>
                      <Link to="/ats/generate" className="stat-card-link">
                        Validación exitosa →
                      </Link>
                    </div>
                    <CheckCircle2 size={32} className="stat-check-icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-right-col">
            <div className="card mb-16">
              <div className="card-header">
                <h2 className="card-title">Estado de Conexión SRI</h2>
              </div>
              <div className="card-body">
                <div className="sri-status-row">
                  <span className="text-sm text-muted">Estado</span>
                  <span className={`badge ${sriConnectionStatus === 'connected' ? 'badge-success' : 'badge-danger'}`}>
                    {sriConnectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <div className="sri-status-row">
                  <span className="text-sm text-muted">Última sincronización</span>
                  <span className="text-sm">{summary.lastSync}</span>
                </div>
                <button
                  id="sync-now-btn"
                  className="btn btn-primary btn-full mt-16"
                  onClick={handleSync}
                  disabled={isSyncing || sriConnectionStatus !== 'connected'}
                >
                  {isSyncing ? <><span className="spinner" />Sincronizando...</> : <><RefreshCw size={15} />Sincronizar Ahora</>}
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Notificaciones</h2>
                <span className="badge badge-danger">
                  {summary.notifications.filter(n => !n.read).length} nuevas
                </span>
              </div>
              <ul className="notification-feed">
                {summary.notifications.map((notif) => (
                  <li key={notif.id} className={`notification-feed-item ${notif.type}`}>
                    <div className={`notif-icon-wrapper notif-${notif.type}`}>
                      <NotificationIcon type={notif.type} />
                    </div>
                    <div className="notif-content">
                      <p className="notif-title">{notif.title}</p>
                      <p className="notif-message">{notif.message}</p>
                      <p className="notif-time">{notif.timestamp}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
