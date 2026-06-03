import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import '../../styles/Auth.css';

export default function SessionClosedPage() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    localStorage.removeItem('sessionClosed');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Sesión Cerrada</h2>
          <p>Tu sesión ha sido cerrada correctamente por seguridad.</p>
        </div>
        
        <div className="auth-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button 
            onClick={handleLoginRedirect}
            className="auth-button"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <LogIn size={20} />
            <span>Volver a Iniciar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
