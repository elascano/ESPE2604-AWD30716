import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  LogOut,
  Package,
  FileStack,
  Link2,
  Calendar,
  Clock,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useWorkspace } from '../../context/WorkspaceContext';
import type { Workspace } from '../../types';
import '../../styles/WorkspaceManagement.css';

// Workspace Management Page - Create, edit, and manage workspaces
export default function WorkspaceManagementPage() {
  const { workspaces, currentWorkspace, selectWorkspace, createWorkspace, deleteWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [newWorkspaceLocation, setNewWorkspaceLocation] = useState('');
  const [periodType, setPeriodType] = useState<'monthly' | 'semi-annual'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newWorkspaceName.trim()) {
      setError('El nombre del workspace es requerido');
      return;
    }

    if (!newWorkspaceLocation.trim()) {
      setError('La ubicación del workspace es requerida');
      return;
    }

    const period = {
      type: periodType,
      month: periodType === 'monthly' ? selectedMonth : undefined,
      semester: periodType === 'semi-annual' ? selectedSemester : undefined,
      year: selectedYear,
    };

    const workspace = await createWorkspace(newWorkspaceName, newWorkspaceDescription, newWorkspaceLocation, period);
    if (workspace) {
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      setNewWorkspaceLocation('');
      setPeriodType('monthly');
      setSelectedMonth(11);
      setSelectedSemester(1);
      setSelectedYear(2025);
      setIsCreating(false);
    } else {
      setError('Error al crear el workspace');
    }
  };

  const handleSelectWorkspace = (workspace: Workspace) => {
    selectWorkspace(workspace);
    navigate('/dashboard');
  };

  const handleDeleteWorkspace = async (workspace: Workspace) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el workspace "${workspace.name}"?`)) {
      const success = await deleteWorkspace(workspace.id);
      if (!success) {
        setError('Error al eliminar el workspace');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSriStatusBadge = (status: string) => {
    if (status === 'connected') {
      return <span className="badge badge-success">Conectado</span>;
    }
    return <span className="badge badge-default">Desconectado</span>;
  };

  const formatPeriod = (period: any) => {
    if (period.type === 'monthly') {
      const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ];
      return `${monthNames[period.month - 1]} ${period.year}`;
    } else {
      return `S${period.semester} ${period.year}`;
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Gestión de Workspaces</h1>
          <p className="page-subtitle">
            Crea y administra tus workspaces. Cada workspace tiene su propio espacio de trabajo
            independiente con trazabilidad y datos aislados.
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-16">
            <p>{error}</p>
          </div>
        )}

        {/* Create New Workspace Form */}
        <div className="card mb-24">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <Plus size={18} className="text-primary" />
              <h2 className="card-title">
                {isCreating ? 'Crear Nuevo Workspace' : 'Crear Workspace'}
              </h2>
            </div>
          </div>

          {isCreating && (
            <div className="card-body">
              <form onSubmit={handleCreateWorkspace} className="form-group">
                <div className="form-field">
                  <label htmlFor="workspace-name">Nombre del Workspace</label>
                  <input
                    id="workspace-name"
                    type="text"
                    className="form-input"
                    placeholder="Ej: Workspace Principal"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="workspace-description">Descripción (Opcional)</label>
                  <textarea
                    id="workspace-description"
                    className="form-input"
                    placeholder="Ej: Workspace para proyectos principales"
                    value={newWorkspaceDescription}
                    onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="workspace-location">Ubicación de Almacenamiento</label>
                  <input
                    id="workspace-location"
                    type="text"
                    className="form-input"
                    placeholder="Ej: /home/user/ats-data/workspace-principal"
                    value={newWorkspaceLocation}
                    onChange={(e) => setNewWorkspaceLocation(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Período</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="period-type"
                        value="monthly"
                        checked={periodType === 'monthly'}
                        onChange={() => setPeriodType('monthly')}
                      />
                      <span>Mensual</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="period-type"
                        value="semi-annual"
                        checked={periodType === 'semi-annual'}
                        onChange={() => setPeriodType('semi-annual')}
                      />
                      <span>Semestral</span>
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  {periodType === 'monthly' ? (
                    <div className="form-field">
                      <label htmlFor="month-select">Mes</label>
                      <select
                        id="month-select"
                        className="form-input"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      >
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="form-field">
                      <label htmlFor="semester-select">Semestre</label>
                      <select
                        id="semester-select"
                        className="form-input"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(parseInt(e.target.value) as 1 | 2)}
                      >
                        <option value={1}>Primer Semestre (Enero - Junio)</option>
                        <option value={2}>Segundo Semestre (Julio - Diciembre)</option>
                      </select>
                    </div>
                  )}

                  <div className="form-field">
                    <label htmlFor="year-select">Año</label>
                    <select
                      id="year-select"
                      className="form-input"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-12">
                  <button type="submit" className="btn btn-primary">
                    Crear Workspace
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsCreating(false);
                      setNewWorkspaceName('');
                      setNewWorkspaceDescription('');
                      setNewWorkspaceLocation('');
                      setPeriodType('monthly');
                      setSelectedMonth(11);
                      setSelectedSemester(1);
                      setSelectedYear(2025);
                      setError('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {!isCreating && (
            <div className="card-body">
              <button
                className="btn btn-primary"
                onClick={() => setIsCreating(true)}
              >
                <Plus size={16} />
                Crear Nuevo Workspace
              </button>
            </div>
          )}
        </div>

        {/* Workspaces List */}
        <div>
          <h2 className="section-title mb-16">Mis Workspaces ({workspaces.length})</h2>

          {workspaces.length === 0 ? (
            <div className="card">
              <div className="card-body text-center">
                <Package size={48} className="mx-auto mb-16 text-gray-400" />
                <p className="text-gray-600 mb-16">
                  No tienes workspaces creados. Crea uno para comenzar.
                </p>
              </div>
            </div>
          ) : (
            <div className="workspace-grid">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className={`workspace-card ${
                    currentWorkspace?.id === workspace.id ? 'active' : ''
                  }`}
                >
                  <div className="workspace-card-header">
                    <div className="flex-1">
                      <h3 className="workspace-name">{workspace.name}</h3>
                      <p className="workspace-description">{workspace.description}</p>
                    </div>
                    {currentWorkspace?.id === workspace.id && (
                      <span className="badge badge-primary">Activo</span>
                    )}
                  </div>

                  <div className="workspace-card-stats">
                    <div className="stat-item">
                      <FileStack size={16} />
                      <span>
                        {workspace.invoicesCount || 0} facturas
                      </span>
                    </div>
                    <div className="stat-item">
                      <Package size={16} />
                      <span>
                        {workspace.atsFilesCount || 0} ATS
                      </span>
                    </div>
                    <div className="stat-item">
                      <Link2 size={16} />
                      {getSriStatusBadge(workspace.sriConnectionStatus)}
                    </div>
                  </div>

                  <div className="workspace-card-dates">
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>
                        Período: {formatPeriod(workspace.period)}
                      </span>
                    </div>
                    <div className="date-info">
                      <span className="text-muted" style={{ fontSize: '12px' }}>
                        📁 {workspace.workspaceLocation}
                      </span>
                    </div>
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>
                        Creado: {formatDate(workspace.createdAt)}
                      </span>
                    </div>
                    {workspace.lastActivityAt && (
                      <div className="date-info">
                        <Clock size={14} />
                        <span>
                          Última actividad: {formatTime(workspace.lastActivityAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="workspace-card-actions">
                    {currentWorkspace?.id !== workspace.id && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSelectWorkspace(workspace)}
                      >
                        <LogOut size={16} />
                        Abrir
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteWorkspace(workspace)}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
