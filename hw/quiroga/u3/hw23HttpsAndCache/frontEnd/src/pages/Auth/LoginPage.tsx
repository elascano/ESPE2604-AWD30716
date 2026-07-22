import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { GoogleLogin } from '@react-oauth/google';
import '../../styles/Auth.css';

interface LoginFormState {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const { login, loginGoogle, isAuthenticated } = useAuth();
  const { sriConnectionStatus } = useWorkspace();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<LoginFormState>({ identifier: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (sriConnectionStatus === 'connected') {
        navigate('/dashboard');
      } else {
        navigate('/sri-connection');
      }
    }
  }, [isAuthenticated, sriConnectionStatus, navigate]);

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    if (!formState.identifier.trim()) newErrors.identifier = 'Ingresa tu usuario o RUC';
    if (!formState.password) newErrors.password = 'Ingresa tu contraseña';
    else if (formState.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const success = await login(formState.identifier, formState.password);
      if (success) {
        const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (storedUser.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/workspaces');
        }
      }
      else setErrors({ general: 'Credenciales incorrectas. Verifica tu usuario y contraseña.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setErrors({});
    const result = await loginGoogle(credentialResponse.credential);
    if (result.success) {
      if (result.needsProfileCompletion) {
        navigate('/complete-profile');
      }
    } else {
      setErrors({ general: 'Error al iniciar sesión con Google.' });
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ general: 'Fallo en la conexión con Google.' });
  };

  const handleChange = (field: keyof LoginFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
    if (errors[field as keyof LoginFormErrors]) setErrors(prev => ({ ...prev, [field]: undefined }));
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
            <h1 className="auth-title">Iniciar Sesión</h1>
            <p className="auth-subtitle">Ingresa tus credenciales para acceder</p>
          </div>

          {errors.general && (
            <div className="alert alert-danger">
              <AlertCircle size={16} />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-identifier" className="form-label">Usuario o RUC</label>
              <input
                id="login-identifier"
                type="text"
                className={`form-input ${errors.identifier ? 'error' : ''}`}
                placeholder="Ingresa tu usuario o RUC"
                value={formState.identifier}
                onChange={handleChange('identifier')}
                autoComplete="username"
              />
              {errors.identifier && (
                <span className="form-error"><AlertCircle size={13} />{errors.identifier}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Contraseña</label>
              <div className="input-password-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Ingresa tu contraseña"
                  value={formState.password}
                  onChange={handleChange('password')}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <span className="form-error"><AlertCircle size={13} />{errors.password}</span>
              )}
            </div>

            <div className="auth-options">
              <label className="checkbox-label">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={formState.rememberMe}
                  onChange={handleChange('rememberMe')}
                />
                <span>Recordarme</span>
              </label>
              <Link to="/forgot-password" className="auth-link text-sm">¿Olvidaste tu contraseña?</Link>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? <><span className="spinner" /> Verificando...</> : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="auth-divider">
            <span>O ingresa con</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              text="continue_with"
            />
          </div>

          <p className="auth-footer-text">
            ¿No tienes una cuenta? <Link to="/register" className="auth-link">Regístrate aquí</Link>
          </p>
        </div>

        <div className="auth-features">
          <div className="auth-feature">
            <CheckCircle2 size={18} className="text-success" />
            <span>Conexión SRI<br />Descarga automática</span>
          </div>
          <div className="auth-feature">
            <CheckCircle2 size={18} className="text-success" />
            <span>ATS XLSM<br />Generación rápida</span>
          </div>
          <div className="auth-feature">
            <CheckCircle2 size={18} className="text-success" />
            <span>Seguro<br />Datos protegidos</span>
          </div>
        </div>

        <p className="auth-copyright">© 2025 ATS Express. Sistema contable para Ecuador.</p>
      </div>
    </div>
  );
}
