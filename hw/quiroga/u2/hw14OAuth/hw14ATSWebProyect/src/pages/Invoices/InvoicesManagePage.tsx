import { useState } from 'react';
import { FolderOpen, Upload, CheckCircle2, AlertCircle, FileText, X, Shield } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { MockInvoices } from '../../data/mockData';
import type { Invoice } from '../../types';
import '../../styles/InvoicesManage.css';

interface ValidationResult {
  valid: Invoice[];
  invalid: { name: string; reason: string }[];
}

export default function InvoicesManagePage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [directoryPath, setDirectoryPath] = useState('');

  const simulateDirectoryValidation = async () => {
    setIsValidating(true);
    setValidationResult(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setValidationResult({
      valid: MockInvoices,
      invalid: [
        { name: 'F004-001-000003.xml', reason: 'El RUC del emisor no corresponde al contribuyente' },
      ],
    });
    setIsValidating(false);
  };

  const handleDirectorySelect = () => {
    setDirectoryPath('C:\\Usuarios\\David\\Documentos\\Facturas\\2025\\Noviembre');
    simulateDirectoryValidation();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    handleDirectorySelect();
  };

  const clearResults = () => {
    setValidationResult(null);
    setDirectoryPath('');
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Gestionar Directorio de Facturas</h1>
        <p className="page-subtitle">Carga y valida tu directorio de facturas XML para preparar la generación del ATS</p>

        <div className="manage-layout">
          <div className="manage-upload-section">
            <div className="card mb-24">
              <div className="card-header">
                <div className="flex items-center gap-8">
                  <FolderOpen size={18} className="text-primary" />
                  <h2 className="card-title">Seleccionar Directorio</h2>
                </div>
              </div>
              <div className="card-body">
                <div
                  className={`directory-dropzone ${isDragOver ? 'drag-over' : ''} ${directoryPath ? 'has-directory' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !directoryPath && handleDirectorySelect()}
                >
                  {directoryPath ? (
                    <div className="directory-selected">
                      <div className="directory-selected-icon">
                        <FolderOpen size={28} />
                      </div>
                      <div className="directory-selected-info">
                        <p className="font-semibold">{directoryPath.split('\\').pop()}</p>
                        <p className="text-sm text-muted">{directoryPath}</p>
                      </div>
                      <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); clearResults(); }}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="dropzone-icon">
                        <Upload size={36} />
                      </div>
                      <p className="dropzone-title">Arrastra tu carpeta aquí</p>
                      <p className="dropzone-subtitle">o haz clic para seleccionar el directorio</p>
                      <span className="badge badge-gray">Formatos: XML, PDF</span>
                    </>
                  )}
                </div>

                <div className="alert alert-info mt-16">
                  <Shield size={16} />
                  <div>
                    <p className="font-semibold">Validación RN-02</p>
                    <p className="text-sm">El sistema verificará que todas las facturas pertenezcan a tu RUC registrado.</p>
                  </div>
                </div>
              </div>
            </div>

            {isValidating && (
              <div className="card">
                <div className="empty-state" style={{ padding: '40px' }}>
                  <span className="spinner spinner-dark" style={{ width: 36, height: 36, borderWidth: 3 }} />
                  <p className="font-semibold mt-16">Validando facturas...</p>
                  <p className="text-sm text-muted">Verificando RUC y formato de archivos XML</p>
                </div>
              </div>
            )}

            {validationResult && !isValidating && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Resultado de Validación</h3>
                  <div className="flex gap-8">
                    <span className="badge badge-success">{validationResult.valid.length} válidas</span>
                    {validationResult.invalid.length > 0 && (
                      <span className="badge badge-danger">{validationResult.invalid.length} inválidas</span>
                    )}
                  </div>
                </div>
                <div className="card-body flex flex-col gap-16">
                  {validationResult.invalid.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-danger mb-8">Facturas con errores:</h4>
                      {validationResult.invalid.map((item) => (
                        <div key={item.name} className="invalid-invoice-item">
                          <AlertCircle size={16} className="text-danger" />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted">{item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="alert alert-success">
                    <CheckCircle2 size={16} />
                    <span>{validationResult.valid.length} facturas validadas correctamente y listas para el ATS.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="manage-info-section">
            <div className="card mb-16">
              <div className="card-header"><h3 className="card-title">Facturas Cargadas</h3></div>
              {validationResult ? (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Proveedor</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationResult.valid.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="text-sm font-medium">{invoice.number}</td>
                          <td className="text-sm">{invoice.issuerName}</td>
                          <td><span className="badge badge-success">Válida</span></td>
                        </tr>
                      ))}
                      {validationResult.invalid.map((item) => (
                        <tr key={item.name}>
                          <td className="text-sm font-medium text-danger">{item.name}</td>
                          <td className="text-sm text-muted">—</td>
                          <td><span className="badge badge-danger">Inválida</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '40px' }}>
                  <div className="empty-state-icon"><FileText size={24} /></div>
                  <p className="empty-state-title">Sin facturas cargadas</p>
                  <p className="empty-state-desc">Selecciona un directorio para ver las facturas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
