import { useState } from 'react';
import { CheckSquare, Upload, AlertCircle, CheckCircle2, XCircle, Info, Download } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import type { ValidationLogEntry } from '../../types';
import '../../styles/AtsModule.css';
import '../../styles/AtsValidate.css';

type ValidationStatus = 'idle' | 'validating' | 'done';

const MOCK_VALIDATION_LOG: ValidationLogEntry[] = [
  { id: 'v1', level: 'error', field: 'F001-001-000002 | Columna D (IVA)', message: 'Valor de IVA no corresponde al 12% de la base imponible. Valor actual: 55.00, Esperado: 60.00', row: 3 },
  { id: 'v2', level: 'error', field: 'F002-001-000010 | Columna E (Total)', message: 'El total facturado no coincide con la suma de base + IVA. Diferencia: 0.01', row: 7 },
  { id: 'v3', level: 'warning', field: 'F003-001-000005 | Columna B (Fecha)', message: 'La fecha 2025-11-25 cae fuera del rango de tolerancia del período declarado.', row: 9 },
  { id: 'v4', level: 'info', field: 'General', message: 'Se detectaron 3 facturas con RUC de emisor que no están en la base del SRI. Revise manualmente.', row: undefined },
];

function LogLevelIcon({ level }: { level: ValidationLogEntry['level'] }) {
  if (level === 'error') return <XCircle size={16} />;
  if (level === 'warning') return <AlertCircle size={16} />;
  return <Info size={16} />;
}

export default function AtsValidatePage() {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [log, setLog] = useState<ValidationLogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  const handleFileUpload = () => {
    setUploadedFileName('ATS_2025_11_v1.xlsm');
    handleValidate();
  };

  const handleValidate = async () => {
    setValidationStatus('validating');
    setLog([]);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setLog(MOCK_VALIDATION_LOG);
    setValidationStatus('done');
  };

  const filteredLog = log.filter(entry => logFilter === 'all' || entry.level === logFilter);
  const errorCount = log.filter(e => e.level === 'error').length;
  const warningCount = log.filter(e => e.level === 'warning').length;
  const hasErrors = errorCount > 0;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Validar ATS en Formato XLSM</h1>
        <p className="page-subtitle">Carga el archivo XLSM editado para detectar errores antes de generar el XML final</p>

        <div className="ats-layout">
          <div className="ats-main">
            <div className="card mb-24">
              <div className="card-header">
                <div className="flex items-center gap-8">
                  <CheckSquare size={18} className="text-primary" />
                  <h2 className="card-title">Cargar Archivo XLSM</h2>
                </div>
              </div>
              <div className="card-body">
                {!uploadedFileName ? (
                  <div className="upload-xlsm-zone" onClick={handleFileUpload}>
                    <div className="upload-xlsm-icon">
                      <Upload size={32} />
                    </div>
                    <p className="font-semibold">Selecciona o arrastra el archivo XLSM</p>
                    <p className="text-sm text-muted">Solo archivos .xlsm editados y listos para validar</p>
                    <span className="badge badge-gray">.xlsm</span>
                  </div>
                ) : (
                  <div className="xlsm-loaded-banner">
                    <CheckCircle2 size={18} className="text-success" />
                    <span className="font-medium">{uploadedFileName}</span>
                    <span className="badge badge-success">Cargado</span>
                  </div>
                )}
              </div>
            </div>

            {validationStatus === 'validating' && (
              <div className="card mb-24">
                <div className="empty-state" style={{ padding: '40px' }}>
                  <span className="spinner spinner-dark" style={{ width: 36, height: 36, borderWidth: 3 }} />
                  <p className="font-semibold mt-16">Validando archivo XLSM...</p>
                  <p className="text-sm text-muted">Revisando campos, fórmulas y cumplimiento con RN-03</p>
                </div>
              </div>
            )}

            {validationStatus === 'done' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Log de Validación</h2>
                  <div className="flex gap-8">
                    {['all','error','warning','info'].map(level => (
                      <button
                        key={level}
                        className={`btn btn-sm ${logFilter === level ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setLogFilter(level as typeof logFilter)}
                        id={`filter-${level}`}
                      >
                        {level === 'all' ? 'Todos' : level === 'error' ? `Errores (${errorCount})` : level === 'warning' ? `Advertencias (${warningCount})` : 'Info'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card-body flex flex-col gap-12">
                  {hasErrors ? (
                    <div className="alert alert-danger">
                      <XCircle size={16} />
                      <span>Se encontraron <strong>{errorCount} errores críticos</strong>. Corrige el XLSM antes de generar el XML.</span>
                    </div>
                  ) : (
                    <div className="alert alert-success">
                      <CheckCircle2 size={16} />
                      <span>Sin errores críticos. El archivo está listo para exportar a XML.</span>
                    </div>
                  )}

                  {filteredLog.length === 0 && (
                    <p className="text-sm text-muted text-center" style={{ padding: '20px 0' }}>No hay entradas para el filtro seleccionado.</p>
                  )}

                  {filteredLog.map((entry) => (
                    <div key={entry.id} className={`log-entry log-entry-${entry.level}`}>
                      <div className={`log-icon log-icon-${entry.level}`}>
                        <LogLevelIcon level={entry.level} />
                      </div>
                      <div className="log-content">
                        <div className="log-header">
                          <span className="log-field">{entry.field}</span>
                          {entry.row && <span className="log-row">Fila {entry.row}</span>}
                        </div>
                        <p className="log-message">{entry.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="ats-sidebar">
            <div className="card mb-16">
              <div className="card-header"><h3 className="card-title">Guía de validación</h3></div>
              <div className="card-body flex flex-col gap-12">
                {[
                  { icon: '🔴', label: 'Error crítico', desc: 'Impide generar el XML. Debes corregir.' },
                  { icon: '🟡', label: 'Advertencia', desc: 'No bloquea el proceso, pero se recomienda revisar.' },
                  { icon: '🔵', label: 'Información', desc: 'Datos adicionales sin impacto en la declaración.' },
                ].map(item => (
                  <div key={item.label} className="guide-item">
                    <span>{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {validationStatus === 'done' && !hasErrors && (
              <div className="card">
                <div className="card-body">
                  <p className="text-sm font-semibold mb-12">¡Archivo válido! Siguiente paso:</p>
                  <a href="/ats/export" className="btn btn-success btn-full" id="go-to-xml-btn">
                    <Download size={16} />Generar ATS XML
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
