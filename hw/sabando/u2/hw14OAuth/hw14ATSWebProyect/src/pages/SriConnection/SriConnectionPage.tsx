import { useState } from 'react';
import { Link2, Shield, AlertCircle, CheckCircle2, Unlink, ExternalLink } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import '../../styles/SriConnection.css';

interface SriFormState {
  username: string;
  password: string;
}

interface SriFormErrors {
  username?: string;
  password?: string;
  general?: string;
}

export default function SriConnectionPage() {
  const { sriConnectionStatus, connectToSri, disconnectFromSri } = useAuth();
  const [formState, setFormState] = useState<SriFormState>({ username: '', password: '' });
  const [errors, setErrors] = useState<SriFormErrors>({});
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = sriConnectionStatus === 'connected';

  const validateForm = (): boolean => {
    const newErrors: SriFormErrors = {};
    if (!formState.username.trim()) newErrors.username = 'Ingresa tu usuario del SRI';
    if (!formState.password) newErrors.password = 'Ingresa tu contraseña del SRI';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConnect = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsConnecting(true);
    setErrors({});
    try {
      const success = await connectToSri(formState.username, formState.password);
      if (success) {
        setFormState({ username: '', password: '' });
      } else {
        setErrors({ general: 'No se pudo conectar con el portal SRI. Verifica tus credenciales.' });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectFromSri();
  };

  const handleChange = (field: keyof SriFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [field]: event.target.value }));
    if (errors[field as keyof SriFormErrors]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Conectar con SRI en Línea</h1>
        <p className="page-subtitle">Vincula tus credenciales del portal SRI para habilitar la descarga automática de facturas</p>

        <div className="sri-connection-grid">
          <div className="sri-form-section">
            {isConnected ? (
              <div className="card">
                <div className="sri-connected-state">
                  <div className="sri-connected-icon">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="sri-connected-title">¡Vinculación exitosa!</h2>
                  <p className="sri-connected-desc">
                    Tu cuenta está conectada al portal SRI en línea. Ahora puedes descargar facturas automáticamente.
                  </p>
                  <div className="sri-connected-info">
                    <div className="info-row">
                      <span>Estado de conexión</span>
                      <span className="badge badge-success">Activo</span>
                    </div>
                    <div className="info-row">
                      <span>Última verificación</span>
                      <span className="text-sm">Hace 15 minutos</span>
                    </div>
                    <div className="info-row">
                      <span>Protocolo</span>
                      <span className="badge badge-info">TLS 1.3</span>
                    </div>
                  </div>
                  <div className="sri-connected-actions">
                    <a href="https://srienlinea.sri.gob.ec" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      <ExternalLink size={15} /> Ver portal SRI
                    </a>
                    <button id="disconnect-sri-btn" className="btn btn-danger" onClick={handleDisconnect}>
                      <Unlink size={15} /> Desconectar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center gap-8">
                    <div className="sri-form-icon">
                      <Link2 size={20} />
                    </div>
                    <div>
                      <h2 className="card-title">Credenciales del SRI en Línea</h2>
                      <p className="text-sm text-muted">Ingresa tus datos de acceso al portal del SRI</p>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {errors.general && (
                    <div className="alert alert-danger mb-16">
                      <AlertCircle size={16} /><span>{errors.general}</span>
                    </div>
                  )}

                  <form onSubmit={handleConnect} className="flex flex-col gap-16" noValidate>
                    <div className="form-group">
                      <label htmlFor="sri-username" className="form-label">Usuario SRI</label>
                      <input
                        id="sri-username"
                        type="text"
                        className={`form-input ${errors.username ? 'error' : ''}`}
                        placeholder="Tu usuario del portal SRI en línea"
                        value={formState.username}
                        onChange={handleChange('username')}
                        autoComplete="username"
                      />
                      {errors.username && <span className="form-error"><AlertCircle size={13} />{errors.username}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="sri-password" className="form-label">Contraseña SRI</label>
                      <input
                        id="sri-password"
                        type="password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        placeholder="Tu contraseña del portal SRI"
                        value={formState.password}
                        onChange={handleChange('password')}
                        autoComplete="current-password"
                      />
                      {errors.password && <span className="form-error"><AlertCircle size={13} />{errors.password}</span>}
                    </div>

                    <div className="alert alert-warning">
                      <Shield size={16} />
                      <div>
                        <p className="font-semibold">Seguridad de datos</p>
                        <p className="text-sm">Tus credenciales no se almacenan. Se usan únicamente para la sesión actual con cifrado TLS 1.3.</p>
                      </div>
                    </div>

                    <button
                      id="connect-sri-btn"
                      type="submit"
                      className="btn btn-primary"
                      disabled={isConnecting}
                    >
                      {isConnecting
                        ? <><span className="spinner" />Conectando con SRI...</>
                        : <><Link2 size={16} />Vincular con SRI en Línea</>}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="sri-info-section">
            <div className="card mb-16">
              <div className="card-header"><h3 className="card-title">¿Qué permite esta vinculación?</h3></div>
              <div className="card-body flex flex-col gap-12">
                {[
                  { icon: '📥', title: 'Descarga automática', desc: 'Obtén tus facturas directamente del SRI sin ingresar manualmente.' },
                  { icon: '📅', title: 'Filtrado por período', desc: 'Descarga facturas por mes o semestre según RN-01.' },
                  { icon: '✅', title: 'Validación de RUC', desc: 'Solo se procesan facturas asociadas a tu RUC (RN-02).' },
                  { icon: '🔒', title: 'Conexión cifrada', desc: 'Toda comunicación usa TLS 1.3 para proteger tus datos.' },
                ].map((item) => (
                  <div key={item.title} className="sri-info-item">
                    <span className="sri-info-emoji">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-sm text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3 className="card-title">Enlace al Portal SRI</h3></div>
              <div className="card-body">
                <p className="text-sm text-muted mb-16">¿Olvidaste tu contraseña del SRI? Puedes restablecerla directamente en el portal oficial.</p>
                <a
                  href="https://srienlinea.sri.gob.ec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-full"
                >
                  <ExternalLink size={15} /> Ir a SRI en Línea
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
