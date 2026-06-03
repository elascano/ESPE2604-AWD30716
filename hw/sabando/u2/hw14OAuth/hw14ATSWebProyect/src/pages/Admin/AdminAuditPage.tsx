import { useState } from 'react';
import { History, Download, Filter, Search } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { MockAuditEvents } from '../../data/mockData';

export default function AdminAuditPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = MockAuditEvents.filter(event => 
    event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Acción', 'Módulo', 'Usuario', 'Detalles', 'Fecha y hora'],
      ...filteredEvents.map(e => [
        e.id, e.action, e.module, e.userId, `"${e.details}"`, new Date(e.timestamp).toLocaleString('es-EC')
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'auditoria_ats_express.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Registro de Auditoría</h1>
        <p className="page-subtitle">Historial completo de acciones realizadas en el sistema por todos los usuarios</p>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <History size={18} className="text-primary" />
              <h2 className="card-title">Eventos del sistema</h2>
            </div>
            <div className="flex gap-8">
              <button id="filter-audit-btn" className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowFilters(!showFilters)}>
                <Filter size={14} />Filtrar
              </button>
              <button id="export-audit-full-btn" className="btn btn-secondary btn-sm" onClick={handleExport}>
                <Download size={14} />Exportar CSV
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="card-body border-b" style={{ background: 'var(--color-gray-50)', padding: '16px 24px' }}>
              <div className="flex items-center gap-12">
                <Search size={16} className="text-muted" />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ maxWidth: '300px' }} 
                  placeholder="Buscar acción, módulo o detalles..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="text-sm text-muted">{filteredEvents.length} resultados</span>
              </div>
            </div>
          )}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Acción</th>
                  <th>Módulo</th>
                  <th>Usuario</th>
                  <th>Detalles</th>
                  <th>Fecha y hora</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="text-xs text-muted font-medium">{event.id}</td>
                    <td><span className="badge badge-info">{event.action}</span></td>
                    <td className="text-sm">{event.module}</td>
                    <td className="text-sm text-muted">{event.userId}</td>
                    <td className="text-sm">{event.details}</td>
                    <td className="text-xs text-muted">{new Date(event.timestamp).toLocaleString('es-EC')}</td>
                  </tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">No se encontraron eventos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
