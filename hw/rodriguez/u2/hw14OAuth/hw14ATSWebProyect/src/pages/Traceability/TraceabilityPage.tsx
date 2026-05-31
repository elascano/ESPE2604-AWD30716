import { History, CheckCircle2, Clock, Lock, Play, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { MockProcessSteps, MockAuditEvents } from '../../data/mockData';
import type { ProcessStep, ProcessStepStatus } from '../../types';
import '../../styles/Traceability.css';

function StepIcon({ status }: { status: ProcessStepStatus }) {
  if (status === 'completed') return <CheckCircle2 size={20} />;
  if (status === 'in-progress') return <Play size={20} />;
  if (status === 'blocked') return <Lock size={20} />;
  return <Clock size={20} />;
}

const STATUS_LABELS: Record<ProcessStepStatus, string> = {
  completed: 'Completado',
  'in-progress': 'En progreso',
  pending: 'Pendiente',
  blocked: 'Bloqueado',
};

function buildCompletionPercentage(steps: ProcessStep[]): number {
  const done = steps.filter(s => s.status === 'completed').length;
  return Math.round((done / steps.length) * 100);
}

export default function TraceabilityPage() {
  const steps = MockProcessSteps;
  const events = MockAuditEvents;
  const completionPercentage = buildCompletionPercentage(steps);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Trazabilidad del Proceso ATS</h1>
        <p className="page-subtitle">
          Visualiza el estado de cada paso del proceso de generación del Anexo Transaccional Simplificado
        </p>

        <div className="traceability-layout">
          <div className="traceability-main">
            <div className="card mb-24">
              <div className="card-header">
                <div className="flex items-center gap-8">
                  <History size={18} className="text-primary" />
                  <h2 className="card-title">Progreso del Proceso</h2>
                </div>
                <span className="badge badge-info">{completionPercentage}% completado</span>
              </div>
              <div className="card-body">
                <div className="process-progress-section">
                  <div className="flex justify-between mb-8">
                    <span className="text-sm text-muted">Avance general</span>
                    <span className="text-sm font-semibold">{completionPercentage}%</span>
                  </div>
                  <div className="progress-bar-wrapper mb-24" style={{ height: 8 }}>
                    <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
                  </div>
                </div>

                <div className="process-steps-list">
                  {steps.map((step, index) => (
                    <div key={step.id} className={`process-step process-step-${step.status}`}>
                      <div className="step-connector-area">
                        <div className={`step-circle step-circle-${step.status}`}>
                          <StepIcon status={step.status} />
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`step-line ${steps[index + 1].status === 'completed' || step.status === 'completed' ? 'step-line-done' : ''}`} />
                        )}
                      </div>
                      <div className="step-content">
                        <div className="step-header">
                          <h3 className="step-title">{step.title}</h3>
                          <span className={`badge badge-${step.status === 'completed' ? 'success' : step.status === 'in-progress' ? 'warning' : step.status === 'blocked' ? 'danger' : 'gray'}`}>
                            {STATUS_LABELS[step.status]}
                          </span>
                        </div>
                        <p className="step-description">{step.description}</p>
                        <div className="step-meta">
                          <span className="badge badge-gray">{step.module}</span>
                          {step.completedAt && (
                            <span className="text-xs text-muted">
                              Completado: {new Date(step.completedAt).toLocaleString('es-EC')}
                            </span>
                          )}
                          {step.status === 'pending' && <span className="text-xs text-muted">En espera de paso anterior</span>}
                          {step.status === 'blocked' && <span className="text-xs text-danger">Bloqueado hasta completar validación</span>}
                        </div>
                        {step.status === 'in-progress' && (
                          <Link to="/ats/generate" className="btn btn-primary btn-sm mt-8" id={`continue-${step.id}`}>
                            <Play size={13} /> Continuar
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="traceability-sidebar">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Historial de Auditoría</h3>
                <span className="badge badge-info">{events.length} eventos</span>
              </div>
              <ul className="audit-event-list">
                {events.map((event) => (
                  <li key={event.id} className="audit-event-item">
                    <div className="audit-event-dot" />
                    <div className="audit-event-content">
                      <div className="flex justify-between items-start">
                        <span className="audit-event-action">{event.action}</span>
                        <span className="badge badge-gray text-xs">{event.module}</span>
                      </div>
                      <p className="audit-event-details">{event.details}</p>
                      <p className="audit-event-time">{new Date(event.timestamp).toLocaleString('es-EC')}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--color-gray-100)' }}>
                <button className="btn btn-secondary btn-sm btn-full" id="export-audit-btn">
                  <Download size={14} />Exportar historial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
