import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import '../../styles/Auth.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!email.trim() || !newPassword.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Ingresa un correo electrónico válido');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/users/reset-password`, {
        email,
        newPassword
      });

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Error al restablecer la contraseña');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-background-blob blob-1" />
        <div className="auth-background-blob blob-2" />
      </div>

      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/" className="auth-logo-link">
            <div className="auth-logo">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20M6 14h16M6 20h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="25" cy="22" r="5" fill="#10B981"/>
                <path d="M23 22l1.5 1.5L27 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="auth-brand-name">ATS Express</span>
          </Link>
          <p className="auth-brand-desc">Automatización de Anexo Transaccional Simplificado</p>
        </div>

        <div className="auth-card animate-scale-in">
          <div className="auth-card-header">
            <h1 className="auth-title">Recuperar Contraseña</h1>
            <p className="auth-subtitle">Ingresa tu correo y una nueva contraseña</p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <CheckCircle2 size={48} className="text-success" />
              </div>
              <h2 style={{ marginBottom: '10px' }}>¡Contraseña Actualizada!</h2>
              <p className="text-muted" style={{ marginBottom: '20px' }}>
                Tu contraseña ha sido restablecida exitosamente.
              </p>
              <Link to="/login" className="btn btn-primary btn-full">
                Ir a Iniciar Sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="reset-email" className="form-label">Correo Electrónico</label>
                <input
                  id="reset-email"
                  type="email"
                  className="form-input"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-password" className="form-label">Nueva Contraseña</label>
                <input
                  id="new-password"
                  type="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={isLoading}
              >
                {isLoading ? <><span className="spinner" /> Procesando...</> : 'Restablecer Contraseña'}
              </button>
            </form>
          )}

          <div className="auth-divider">
            <span>o</span>
          </div>

          <p className="auth-footer-text">
            ¿Recordaste tu contraseña? <Link to="/login" className="auth-link">Volver al Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
