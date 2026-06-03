import { useState } from 'react';
import { FileSpreadsheet, Play, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { MockInvoices, MockAtsFiles } from '../../data/mockData';
import type { AtsFile } from '../../types';
import '../../styles/AtsModule.css';

type GenerationStatus = 'idle' | 'processing' | 'done' | 'error';

export default function AtsGeneratePage() {
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [generatedFile, setGeneratedFile] = useState<AtsFile | null>(null);
  const [progress, setProgress] = useState(0);

  const simulateGeneration = async () => {
    setGenerationStatus('processing');
    setProgress(0);
    const intervals = [20, 40, 60, 80, 100];
    for (const target of intervals) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(target);
    }
    setGeneratedFile(MockAtsFiles[0]);
    setGenerationStatus('done');
  };

  const handleGenerate = () => {
    simulateGeneration();
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Generar ATS en Formato XLSM</h1>
        <p className="page-subtitle">
          Crea automáticamente el Anexo Transaccional Simplificado en formato Excel Macro a partir de las facturas cargadas
        </p>

        <div className="ats-layout">
          <div className="ats-main">
            <div className="card mb-24">
              <div className="card-header">
                <div className="flex items-center gap-8">
                  <FileSpreadsheet size={18} className="text-primary" />
                  <h2 className="card-title">Estado de Generación</h2>
                </div>
                {generationStatus === 'done' && <span className="badge badge-success">Completado</span>}
                {generationStatus === 'processing' && <span className="badge badge-warning">Procesando</span>}
              </div>
              <div className="card-body">
                {generationStatus === 'idle' && (
                  <div className="generation-idle">
                    <div className="generation-idle-icon">
                      <FileSpreadsheet size={40} />
                    </div>
                    <h3>Listo para generar</h3>
                    <p className="text-muted">
                      Se procesarán {MockInvoices.length} facturas validadas del directorio cargado.
                      El sistema verificará que todas pertenezcan a tu RUC único.
                    </p>
                    <div className="generation-info-grid">
                      <div className="generation-info-item">
                        <span className="generation-info-value">{MockInvoices.length}</span>
                        <span className="generation-info-label">Facturas a procesar</span>
                      </div>
                      <div className="generation-info-item">
                        <span className="generation-info-value">Noviembre 2025</span>
                        <span className="generation-info-label">Período tributario</span>
                      </div>
                      <div className="generation-info-item">
                        <span className="generation-info-value">{'< 5s'}</span>
                        <span className="generation-info-label">Tiempo estimado</span>
                      </div>
                    </div>
                    <button
                      id="generate-xlsm-btn"
                      className="btn btn-primary"
                      onClick={handleGenerate}
                    >
                      <Play size={16} />Generar ATS XLSM
                    </button>
                  </div>
                )}

                {generationStatus === 'processing' && (
                  <div className="generation-processing">
                    <div className="processing-animation">
                      <FileSpreadsheet size={36} />
                    </div>
                    <h3>Generando ATS XLSM...</h3>
                    <p className="text-muted">Transcribiendo facturas al formato ATS del SRI</p>
                    <div className="processing-progress">
                      <div className="flex justify-between mb-8">
                        <span className="text-sm text-muted">Progreso</span>
                        <span className="text-sm font-semibold">{progress}%</span>
                      </div>
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-muted mt-8">
                        {progress < 40 ? 'Leyendo facturas XML...' : progress < 70 ? 'Validando campos ATS...' : 'Generando archivo XLSM...'}
                      </p>
                    </div>
                  </div>
                )}

                {generationStatus === 'done' && generatedFile && (
                  <div className="generation-done">
                    <div className="done-icon">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3>¡ATS XLSM generado exitosamente!</h3>
                    <p className="text-muted">
                      El archivo ha sido creado con {generatedFile.invoiceCount} facturas en {generatedFile.validationErrors} errores detectados.
                    </p>
                    <div className="done-file-card">
                      <FileSpreadsheet size={24} className="text-success" />
                      <div>
                        <p className="font-semibold">{generatedFile.name}</p>
                        <p className="text-sm text-muted">
                          {generatedFile.invoiceCount} facturas · Creado: {new Date(generatedFile.createdAt).toLocaleDateString('es-EC')}
                        </p>
                      </div>
                      <a href={generatedFile.downloadUrl} className="btn btn-success btn-sm" id="download-xlsm-btn">
                        <Download size={14} />Descargar
                      </a>
                    </div>
                    {generatedFile.validationErrors > 0 && (
                      <div className="alert alert-warning mt-16">
                        <AlertCircle size={16} />
                        <span>{generatedFile.validationErrors} advertencias detectadas. Se recomienda validar el XLSM antes de generar el XML.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h2 className="card-title">Historial de ATS Generados</h2></div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Archivo</th>
                      <th>Período</th>
                      <th>Facturas</th>
                      <th>Errores</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MockAtsFiles.map((file) => (
                      <tr key={file.id}>
                        <td>
                          <div className="flex items-center gap-8">
                            <FileSpreadsheet size={16} className="text-muted" />
                            <span className="font-medium text-sm">{file.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info">
                            {file.period.type === 'monthly'
                              ? `Mes ${file.period.month}/${file.period.year}`
                              : `S${file.period.semester} ${file.period.year}`}
                          </span>
                        </td>
                        <td className="text-sm">{file.invoiceCount}</td>
                        <td>
                          <span className={`badge ${file.validationErrors === 0 ? 'badge-success' : 'badge-warning'}`}>
                            {file.validationErrors === 0 ? 'Sin errores' : `${file.validationErrors} errores`}
                          </span>
                        </td>
                        <td className="text-sm text-muted">{new Date(file.createdAt).toLocaleDateString('es-EC')}</td>
                        <td>
                          <a href={file.downloadUrl} className="btn btn-ghost btn-sm">
                            <Download size={14} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="ats-sidebar">
            <div className="card mb-16">
              <div className="card-header"><h3 className="card-title">Requisitos previos</h3></div>
              <div className="card-body flex flex-col gap-12">
                {[
                  { done: true, label: 'Conectado con SRI' },
                  { done: true, label: 'Facturas descargadas' },
                  { done: true, label: 'Directorio cargado y validado' },
                  { done: generationStatus === 'done', label: 'ATS XLSM generado' },
                ].map((req) => (
                  <div key={req.label} className="requirement-item">
                    {req.done
                      ? <CheckCircle2 size={18} className="text-success" />
                      : <Clock size={18} className="text-muted" />}
                    <span className={`text-sm ${req.done ? 'text-success font-medium' : 'text-muted'}`}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3 className="card-title">Información del proceso</h3></div>
              <div className="card-body flex flex-col gap-12">
                {[
                  { label: 'Formato de salida', value: 'XLSM (Excel Macro)' },
                  { label: 'Validación', value: 'Campos RN-03' },
                  { label: 'Singularidad', value: 'Un solo RUC (RN-02)' },
                  { label: 'Tiempo máximo', value: '5 segundos (RNF-03)' },
                ].map((info) => (
                  <div key={info.label} className="info-detail-row">
                    <span className="text-sm text-muted">{info.label}</span>
                    <span className="text-sm font-medium">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
