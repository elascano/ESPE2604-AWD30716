import { useState } from 'react';
import { FileCode2, Download, CheckCircle2, Shield, ExternalLink } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import type { AtsFile } from '../../types';
import '../../styles/AtsModule.css';
import '../../styles/AtsExport.css';

type ExportStatus = 'idle' | 'generating' | 'done';

const GENERATED_XML_FILE: AtsFile = {
  id: 'xml001',
  name: 'ATS_2025_11_final.xml',
  format: 'XML',
  period: { type: 'monthly', month: 11, year: 2025 },
  createdAt: new Date().toISOString(),
  invoiceCount: 247,
  validationErrors: 0,
  downloadUrl: '#',
};

export default function AtsExportPage() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportedFile, setExportedFile] = useState<AtsFile | null>(null);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    setExportStatus('generating');
    setProgress(0);
    for (const target of [25, 50, 75, 100]) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setProgress(target);
    }
    setExportedFile(GENERATED_XML_FILE);
    setExportStatus('done');
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Exportar ATS en Formato XML</h1>
        <p className="page-subtitle">
          Genera el archivo XML final compatible con el esquema DIMM del SRI, listo para declarar oficialmente
        </p>

        <div className="ats-layout">
          <div className="ats-main">
            <div className="card mb-24">
              <div className="card-header">
                <div className="flex items-center gap-8">
                  <FileCode2 size={18} className="text-primary" />
                  <h2 className="card-title">Generación del XML</h2>
                </div>
                {exportStatus === 'done' && <span className="badge badge-success">Listo para declarar</span>}
              </div>
              <div className="card-body">
                {exportStatus === 'idle' && (
                  <div className="generation-idle">
                    <div className="generation-idle-icon">
                      <FileCode2 size={40} />
                    </div>
                    <h3>Generar ATS XML</h3>
                    <p className="text-muted">
                      El sistema convertirá el XLSM validado al formato XML requerido por el DIMM del SRI en codificación UTF-8.
                    </p>
                    <div className="generation-info-grid">
                      <div className="generation-info-item">
                        <span className="generation-info-value">UTF-8</span>
                        <span className="generation-info-label">Codificación</span>
                      </div>
                      <div className="generation-info-item">
                        <span className="generation-info-value">DIMM SRI</span>
                        <span className="generation-info-label">Esquema</span>
                      </div>
                      <div className="generation-info-item">
                        <span className="generation-info-value">247</span>
                        <span className="generation-info-label">Facturas</span>
                      </div>
                    </div>
                    <div className="xml-format-preview">
                      <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<ats xmlns="www.sri.gob.ec">
  <InfoGeneral>
    <rucSocio>1234567890001</rucSocio>
    <periodoFiscal>11/2025</periodoFiscal>
    ...
  </InfoGeneral>
</ats>`}</pre>
                    </div>
                    <button
                      id="generate-xml-btn"
                      className="btn btn-primary"
                      onClick={handleExport}
                    >
                      <FileCode2 size={16} />Generar ATS XML
                    </button>
                  </div>
                )}

                {exportStatus === 'generating' && (
                  <div className="generation-processing">
                    <div className="processing-animation">
                      <FileCode2 size={36} />
                    </div>
                    <h3>Generando XML DIMM...</h3>
                    <p className="text-muted">Aplicando esquema DIMM del SRI y codificación UTF-8</p>
                    <div className="processing-progress">
                      <div className="flex justify-between mb-8">
                        <span className="text-sm text-muted">Progreso</span>
                        <span className="text-sm font-semibold">{progress}%</span>
                      </div>
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-muted mt-8">
                        {progress < 50 ? 'Convirtiendo datos XLSM...' : progress < 80 ? 'Aplicando esquema DIMM SRI...' : 'Validando XML generado...'}
                      </p>
                    </div>
                  </div>
                )}

                {exportStatus === 'done' && exportedFile && (
                  <div className="generation-done">
                    <div className="done-icon">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3>¡XML generado exitosamente!</h3>
                    <p className="text-muted">
                      El archivo cumple con el esquema DIMM del SRI y está listo para ser subido al portal oficial.
                    </p>
                    <div className="done-file-card">
                      <FileCode2 size={24} className="text-success" />
                      <div>
                        <p className="font-semibold">{exportedFile.name}</p>
                        <p className="text-sm text-muted">
                          UTF-8 · {exportedFile.invoiceCount} registros · DIMM compatible
                        </p>
                      </div>
                      <a href={exportedFile.downloadUrl} className="btn btn-success btn-sm" id="download-xml-btn">
                        <Download size={14} />Descargar
                      </a>
                    </div>
                    <div className="alert alert-success" style={{ maxWidth: 460 }}>
                      <CheckCircle2 size={16} />
                      <span>XML validado y compatible con el esquema DIMM SRI. Puedes subirlo directamente al portal.</span>
                    </div>
                    <a
                      href="https://declaraciones.sri.gob.ec/tuportal-internet/acceso.jspa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      id="go-to-dimm-btn"
                    >
                      <ExternalLink size={15} />Ir al DIMM del SRI
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="ats-sidebar">
            <div className="card mb-16">
              <div className="card-header"><h3 className="card-title">Requisitos de exportación</h3></div>
              <div className="card-body flex flex-col gap-12">
                {[
                  { done: true, label: 'XLSM validado sin errores' },
                  { done: true, label: 'Período tributario correcto' },
                  { done: true, label: 'RUC único verificado' },
                  { done: exportStatus === 'done', label: 'XML DIMM generado' },
                ].map(req => (
                  <div key={req.label} className="requirement-item">
                    {req.done
                      ? <CheckCircle2 size={18} className="text-success" />
                      : <Shield size={18} className="text-muted" />}
                    <span className={`text-sm ${req.done ? 'font-medium' : 'text-muted'}`}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3 className="card-title">Especificaciones XML</h3></div>
              <div className="card-body flex flex-col gap-12">
                {[
                  { label: 'Formato', value: 'XML' },
                  { label: 'Codificación', value: 'UTF-8' },
                  { label: 'Esquema', value: 'DIMM SRI' },
                  { label: 'Versión ATS', value: '1.09' },
                  { label: 'Compresión', value: 'ZIP para DIMM' },
                ].map(info => (
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
