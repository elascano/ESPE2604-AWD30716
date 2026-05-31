import { useState } from 'react';
import { Download, Filter, Calendar, CheckCircle2 } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { MockInvoices } from '../../data/mockData';
import type { Invoice, TaxPeriodType } from '../../types';
import '../../styles/InvoicesDownload.css';

interface DownloadFilterState {
  periodType: TaxPeriodType;
  month: string;
  semester: string;
  year: string;
}

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

export default function InvoicesDownloadPage() {
  const [filterState, setFilterState] = useState<DownloadFilterState>({
    periodType: 'monthly',
    month: '11',
    semester: '2',
    year: String(CURRENT_YEAR),
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedInvoices, setDownloadedInvoices] = useState<Invoice[]>([]);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadComplete(false);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setDownloadedInvoices(MockInvoices);
    setDownloadComplete(true);
    setIsDownloading(false);
  };

  const handleFilterChange = (field: keyof DownloadFilterState) => (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterState(prev => ({ ...prev, [field]: event.target.value }));
    setDownloadComplete(false);
    setDownloadedInvoices([]);
  };

  const totalAmount = downloadedInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Descargar Facturas del SRI</h1>
        <p className="page-subtitle">Selecciona el período tributario y descarga automáticamente tus facturas desde el portal SRI</p>

        <div className="download-layout">
          <div className="download-filter-panel card">
            <div className="card-header">
              <div className="flex items-center gap-8">
                <Filter size={18} className="text-primary" />
                <h2 className="card-title">Filtros de Descarga</h2>
              </div>
            </div>
            <div className="card-body flex flex-col gap-16">
              <div className="form-group">
                <label htmlFor="period-type" className="form-label">Tipo de Período</label>
                <select
                  id="period-type"
                  className="form-select"
                  value={filterState.periodType}
                  onChange={handleFilterChange('periodType')}
                >
                  <option value="monthly">Mensual</option>
                  <option value="semi-annual">Semestral</option>
                </select>
                <span className="form-hint">Según RN-01: solo facturas del período seleccionado</span>
              </div>

              {filterState.periodType === 'monthly' ? (
                <div className="form-group">
                  <label htmlFor="month-select" className="form-label">Mes</label>
                  <select id="month-select" className="form-select" value={filterState.month} onChange={handleFilterChange('month')}>
                    {MONTHS.map((month, index) => (
                      <option key={month} value={String(index + 1)}>{month}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="semester-select" className="form-label">Semestre</label>
                  <select id="semester-select" className="form-select" value={filterState.semester} onChange={handleFilterChange('semester')}>
                    <option value="1">Primer Semestre (Enero - Junio)</option>
                    <option value="2">Segundo Semestre (Julio - Diciembre)</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="year-select" className="form-label">Año</label>
                <select id="year-select" className="form-select" value={filterState.year} onChange={handleFilterChange('year')}>
                  {AVAILABLE_YEARS.map(year => (
                    <option key={year} value={String(year)}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="download-period-summary">
                <Calendar size={16} />
                <span>
                  {filterState.periodType === 'monthly'
                    ? `${MONTHS[parseInt(filterState.month) - 1]} ${filterState.year}`
                    : `Semestre ${filterState.semester} - ${filterState.year}`}
                </span>
              </div>

              <button
                id="download-invoices-btn"
                className="btn btn-primary btn-full"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading
                  ? <><span className="spinner" />Descargando desde SRI...</>
                  : <><Download size={16} />Descargar Facturas</>}
              </button>
            </div>
          </div>

          <div className="download-results">
            {!downloadComplete && !isDownloading && (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-state-icon"><Download size={28} /></div>
                  <p className="empty-state-title">Sin facturas descargadas</p>
                  <p className="empty-state-desc">Selecciona un período y presiona "Descargar Facturas" para obtener tus documentos del SRI.</p>
                </div>
              </div>
            )}

            {isDownloading && (
              <div className="card">
                <div className="download-progress-state">
                  <div className="download-spinner-large">
                    <span className="spinner spinner-dark" style={{ width: 40, height: 40, borderWidth: 3 }} />
                  </div>
                  <h3>Conectando con el SRI...</h3>
                  <p className="text-muted">Descargando facturas del período seleccionado</p>
                  <div className="progress-bar-wrapper mt-16" style={{ maxWidth: 300 }}>
                    <div className="progress-bar-fill" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            )}

            {downloadComplete && (
              <>
                <div className="alert alert-success mb-16">
                  <CheckCircle2 size={18} />
                  <div>
                    <p className="font-semibold">Descarga completada exitosamente</p>
                    <p className="text-sm">{downloadedInvoices.length} facturas descargadas y almacenadas correctamente.</p>
                  </div>
                </div>

                <div className="download-stats-row mb-24">
                  <div className="download-stat-card">
                    <span className="download-stat-value">{downloadedInvoices.length}</span>
                    <span className="download-stat-label">Facturas totales</span>
                  </div>
                  <div className="download-stat-card">
                    <span className="download-stat-value">{downloadedInvoices.filter(i => i.format === 'XML').length}</span>
                    <span className="download-stat-label">En formato XML</span>
                  </div>
                  <div className="download-stat-card">
                    <span className="download-stat-value">${totalAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                    <span className="download-stat-label">Monto total</span>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Facturas Descargadas</h3>
                    <span className="badge badge-success">{downloadedInvoices.length} facturas</span>
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Número</th>
                          <th>Proveedor</th>
                          <th>RUC Emisor</th>
                          <th>Fecha</th>
                          <th>Base Imponible</th>
                          <th>IVA</th>
                          <th>Total</th>
                          <th>Formato</th>
                        </tr>
                      </thead>
                      <tbody>
                        {downloadedInvoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="font-medium">{invoice.number}</td>
                            <td>{invoice.issuerName}</td>
                            <td className="text-muted text-sm">{invoice.issuerRuc}</td>
                            <td>{invoice.date}</td>
                            <td>${invoice.taxBase.toFixed(2)}</td>
                            <td>${invoice.iva.toFixed(2)}</td>
                            <td className="font-semibold">${invoice.total.toFixed(2)}</td>
                            <td>
                              <span className={`badge ${invoice.format === 'XML' ? 'badge-info' : 'badge-gray'}`}>
                                {invoice.format}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
