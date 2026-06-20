import { useState, useEffect } from 'react';
import './index.css'; // Make sure styles are imported

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Using JSONPlaceholder as a mock GET URI
  const API_URI = 'https://jsonplaceholder.typicode.com/users';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URI);
        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
        }
        const result = await response.json();
        // Simular un pequeño retardo para mostrar el loader (opcional)
        setTimeout(() => {
          setData(result);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <header className="glass glass-header fade-in">
        <div>
          <h1>Reporte de Usuarios</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Obteniendo datos desde <code style={{ color: 'var(--accent-color)' }}>{API_URI}</code>
          </p>
        </div>
        <button className="btn" onClick={() => window.location.reload()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21v-5h5" />
          </svg>
          Actualizar Datos
        </button>
      </header>

      {/* Metrics Section */}
      <div className="metrics-grid fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="glass metric-card">
          <span>Total Usuarios</span>
          <h3>{loading ? '-' : data.length}</h3>
        </div>
        <div className="glass metric-card">
          <span>Estado del Servicio</span>
          <h3>
            {loading ? '-' : (error ? <span style={{color: 'var(--danger)'}}>Error</span> : <span style={{color: 'var(--success)'}}>Activo</span>)}
          </h3>
        </div>
        <div className="glass metric-card">
          <span>Última Actualización</span>
          <h3>{new Date().toLocaleTimeString()}</h3>
        </div>
      </div>

      {/* Main Content */}
      <main className="glass p-6 fade-in" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="loader"></div>
            <p style={{ color: 'var(--text-secondary)' }}>Cargando reporte de datos...</p>
          </div>
        ) : error ? (
          <div style={{ color: 'var(--danger)', padding: '2rem', textAlign: 'center' }}>
            <svg style={{ margin: '0 auto 1rem' }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2>Error al cargar los datos</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Empresa</th>
                  <th>Sitio Web</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user.id}>
                    <td><span className="badge badge-blue">#{user.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{user.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>@{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.company.name}</td>
                    <td>
                      <a 
                        href={`http://${user.website}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: 'var(--accent-color)', textDecoration: 'none' }}
                      >
                        {user.website}
                      </a>
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
