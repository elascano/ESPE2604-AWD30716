import { Link } from 'react-router-dom';

export default function NoSessionPage() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
      <div style={{ textAlign: 'center', padding: 24 }}>
        <h1>No hay sesión activa</h1>
        <p>Debes iniciar sesión para acceder al panel de control.</p>
        <div style={{ marginTop: 16 }}>
          <Link to="/login" className="btn btn-primary">Ir al Login</Link>
        </div>
      </div>
    </div>
  );
}
