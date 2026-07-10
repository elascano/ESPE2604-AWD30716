import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Link2,
  Download,
  FileSpreadsheet,
  FileCode2,
  RefreshCw,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import axios from 'axios';
import '../../styles/Dashboard.css';

const BUSINESS_SERVICE_URL = import.meta.env.VITE_BUSINESS_SERVICE_DEPLOY_URL || import.meta.env.VITE_BUSINESS_SERVICE_DEV_URL;

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


export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { sriConnectionStatus, currentWorkspace } = useWorkspace();
  const [isSyncing, setIsSyncing] = useState(false);
  const [summary, setSummary] = useState({
    invoicesDownloaded: 0,
    invoicesDownloadedChange: 0,
    errorsDetected: 0,
    lastSync: 'No sincronizado',
  });

  useEffect(() => {
    if (currentUser?.id) {
      axios.get(`${BUSINESS_SERVICE_URL}/dashboard/${currentUser.id}`)
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
    // Real sync logic would go here
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Bienvenido a ATS Express</h1>
        <p className="page-subtitle">
          {currentWorkspace && (
            <>Workspace: <strong>{currentWorkspace.name}</strong> - </>
          )}
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
