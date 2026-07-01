import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './index.css';

// Mock Data Financiera de Pacientes
const MOCK_PATIENTS = [
  { id: 1, name: 'Carlos Mendoza', treatment: 'Ortodoncia', totalCost: 1500, paidAmount: 1500, paymentMethod: 'Transferencia', date: '2023-10-12' },
  { id: 2, name: 'Ana Silva', treatment: 'Implante Dental', totalCost: 2000, paidAmount: 800, paymentMethod: 'Efectivo', date: '2023-10-15' },
  { id: 3, name: 'Luis García', treatment: 'Limpieza', totalCost: 50, paidAmount: 50, paymentMethod: 'Efectivo', date: '2023-10-18' },
  { id: 4, name: 'Marta Rojas', treatment: 'Endodoncia', totalCost: 350, paidAmount: 150, paymentMethod: 'Transferencia', date: '2023-10-20' },
  { id: 5, name: 'Jorge Pérez', treatment: 'Extracción', totalCost: 120, paidAmount: 0, paymentMethod: '-', date: '2023-10-21' },
  { id: 6, name: 'Elena Torres', treatment: 'Blanqueamiento', totalCost: 250, paidAmount: 250, paymentMethod: 'Transferencia', date: '2023-10-22' },
];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando carga de API
    setTimeout(() => {
      // Procesamos datos para añadir status y balance
      const processedData = MOCK_PATIENTS.map(p => {
        const balance = p.totalCost - p.paidAmount;
        let status = 'Pendiente';
        if (balance === 0) status = 'Pagado';
        else if (p.paidAmount > 0) status = 'Abono';

        return { ...p, balance, status };
      });
      setData(processedData);
      setLoading(false);
    }, 600);
  }, []);

  // Cálculos de Métricas
  const totalProfit = data.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const upToDatePatients = data.filter(p => p.status === 'Pagado').length;
  
  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Reporte Financiero Mensual - Clinica Dental', 14, 22);

    // Resumen de métricas
    doc.setFontSize(12);
    doc.text(`Fecha de emision: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Ganancia Total Recaudada: $${totalProfit.toFixed(2)}`, 14, 40);
    doc.text(`Pacientes Totales: ${data.length}`, 14, 48);
    doc.text(`Pacientes al dia (Pagados): ${upToDatePatients}`, 14, 56);

    // Tabla
    const tableColumn = ["Paciente", "Tratamiento", "Costo", "Abonado", "Saldo", "Estado", "Metodo"];
    const tableRows = [];

    data.forEach(patient => {
      const patientData = [
        patient.name,
        patient.treatment,
        `$${patient.totalCost}`,
        `$${patient.paidAmount}`,
        `$${patient.balance}`,
        patient.status,
        patient.paymentMethod
      ];
      tableRows.push(patientData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [240, 248, 255] }
    });

    doc.save(`Reporte_Financiero_${new Date().getTime()}.pdf`);
  };

  // Helpers para estilos
  const getStatusBadge = (status) => {
    if (status === 'Pagado') return 'badge-green';
    if (status === 'Abono') return 'badge-warning';
    return 'badge-danger';
  };

  const getMethodBadge = (method) => {
    if (method === 'Transferencia') return 'badge-blue';
    if (method === 'Efectivo') return 'badge-purple';
    return '';
  };

  return (
    <div className="container">
      <header className="glass glass-header fade-in">
        <div>
          <h1>Reporte Financiero de Pacientes</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Resumen mensual de pagos, abonos y deudas.
          </p>
        </div>
        <button className="btn btn-success" onClick={exportToPDF} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar PDF
        </button>
      </header>

      {/* Metrics Section */}
      <div className="metrics-grid fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="glass metric-card">
          <span>Ganancia del Mes (Cobrado)</span>
          <h3 style={{ color: 'var(--success)' }}>
            {loading ? '-' : `$${totalProfit.toFixed(2)}`}
          </h3>
        </div>
        <div className="glass metric-card">
          <span>Pacientes Atendidos</span>
          <h3>{loading ? '-' : data.length}</h3>
        </div>
        <div className="glass metric-card">
          <span>Pacientes al Día (Completos)</span>
          <h3>
            {loading ? '-' : `${upToDatePatients} / ${data.length}`}
          </h3>
        </div>
      </div>

      {/* Main Content */}
      <main className="glass p-6 fade-in" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="loader"></div>
            <p style={{ color: 'var(--text-secondary)' }}>Procesando reporte financiero...</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Tratamiento</th>
                  <th>Costo Total</th>
                  <th>Monto Pagado</th>
                  <th>Saldo / Deuda</th>
                  <th>Estado</th>
                  <th>Método Pago</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.treatment}</td>
                    <td className="currency">${p.totalCost.toFixed(2)}</td>
                    <td className="currency" style={{ color: 'var(--success)' }}>${p.paidAmount.toFixed(2)}</td>
                    <td className="currency" style={{ color: p.balance > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                      ${p.balance.toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.paymentMethod !== '-' ? (
                        <span className={`badge ${getMethodBadge(p.paymentMethod)}`}>
                          {p.paymentMethod}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
