import { useState } from 'react';
import { User, Mail, Hash, Calendar, Save, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/Profile.css';

const BUSINESS_SERVICE_URL = import.meta.env.VITE_BUSINESS_SERVICE_DEPLOY_URL || import.meta.env.VITE_BUSINESS_SERVICE_DEV_URL;

function isValidName(name: string): boolean {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name);
}

export default function ProfilePage() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({
    firstName: currentUser?.firstName || '',
    secondName: currentUser?.secondName || '',
    firstLastName: currentUser?.firstLastName || '',
    secondLastName: currentUser?.secondLastName || '',
    email: currentUser?.email || '',
    birthDate: typeof currentUser?.birthDate === 'string' ? currentUser.birthDate : '',
  });

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!formState.firstName.trim() || !formState.firstLastName.trim() || !formState.email.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!isValidName(formState.firstName) || !isValidName(formState.firstLastName)) {
      setError('El primer nombre y primer apellido no deben contener números ni símbolos');
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.put(`${BUSINESS_SERVICE_URL}/taxpayer/profile/${currentUser?.id}`, {
        firstName: formState.firstName,
        lastName: formState.firstLastName,
      });

      if (response.data.success) {
        updateCurrentUser({
          firstName: formState.firstName,
          secondName: formState.secondName,
          firstLastName: formState.firstLastName,
          secondLastName: formState.secondLastName,
          email: formState.email,
          birthDate: formState.birthDate
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(response.data.message || 'Error al actualizar el perfil');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de conexión con el servidor');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [field]: event.target.value }));
    setSaved(false);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-subtitle">Administra tu información personal y configuración de cuenta</p>

        <div className="profile-layout">
          <div className="profile-avatar-section">
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center', padding: '32px' }}>
                <div className="profile-avatar-large">
                  {currentUser?.firstName?.[0]}{currentUser?.firstLastName?.[0]}
                </div>
                <button id="change-avatar-btn" className="btn btn-secondary btn-sm mt-16">
                  <Camera size={14} />Cambiar foto
                </button>
                <div style={{ marginTop: '20px' }}>
                  <p className="font-semibold">{currentUser?.firstName} {currentUser?.firstLastName}</p>
                  <p className="text-sm text-muted">{currentUser?.isAdmin ? 'Administrador' : 'Contador'}</p>
                </div>
                <div className="profile-ruc-badge">
                  <Hash size={14} />
                  <span>{currentUser?.RUC}</span>
                </div>
                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="font-bold">247</span>
                    <span className="text-xs text-muted">Facturas</span>
                  </div>
                  <div className="profile-stat-divider" />
                  <div className="profile-stat">
                    <span className="font-bold">3</span>
                    <span className="text-xs text-muted">ATS generados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <div className="card mb-24">
              <div className="card-header">
                <div className="flex items-center gap-8">
                  <User size={18} className="text-primary" />
                  <h2 className="card-title">Información Personal</h2>
                </div>
                {saved && <span className="badge badge-success">¡Guardado!</span>}
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger mb-16">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                <form id="profile-form" onSubmit={handleSave} className="flex flex-col gap-16">
                  <div className="grid-2">
                    <div className="form-group">
                      <label htmlFor="profile-firstname" className="form-label"><User size={14} /> Primer Nombre</label>
                      <input id="profile-firstname" type="text" className="form-input" value={formState.firstName} onChange={handleChange('firstName')} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-secondname" className="form-label">Segundo Nombre</label>
                      <input id="profile-secondname" type="text" className="form-input" value={formState.secondName || ''} onChange={handleChange('secondName')} />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label htmlFor="profile-firstlastname" className="form-label">Primer Apellido</label>
                      <input id="profile-firstlastname" type="text" className="form-input" value={formState.firstLastName} onChange={handleChange('firstLastName')} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-secondlastname" className="form-label">Segundo Apellido</label>
                      <input id="profile-secondlastname" type="text" className="form-input" value={formState.secondLastName || ''} onChange={handleChange('secondLastName')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-email" className="form-label"><Mail size={14} /> Correo Electrónico</label>
                    <input id="profile-email" type="email" className="form-input" value={formState.email} onChange={handleChange('email')} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-ruc" className="form-label"><Hash size={14} /> Número de RUC</label>
                    <input id="profile-ruc" type="text" className="form-input" value={currentUser?.RUC || ''} disabled style={{ background: 'var(--color-gray-50)', color: 'var(--color-gray-500)' }} />
                    <span className="form-hint">El RUC no puede modificarse. Es el identificador único de tu cuenta.</span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-birthdate" className="form-label"><Calendar size={14} /> Fecha de Nacimiento</label>
                    <input id="profile-birthdate" type="date" className="form-input" value={formState.birthDate} onChange={handleChange('birthDate')} />
                  </div>
                  <button id="save-profile-btn" type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={isSaving}>
                    {isSaving ? <><span className="spinner" />Guardando...</> : <><Save size={16} />Guardar cambios</>}
                  </button>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h2 className="card-title">Seguridad de la cuenta</h2></div>
              <div className="card-body flex flex-col gap-16">
                <div className="security-row">
                  <div>
                    <p className="font-semibold text-sm">Cambiar contraseña</p>
                    <p className="text-sm text-muted">Última actualización: hace 3 meses</p>
                  </div>
                  <button id="change-password-btn" className="btn btn-secondary btn-sm">Cambiar</button>
                </div>
                <div className="security-row">
                  <div>
                    <p className="font-semibold text-sm">Autenticación de dos factores</p>
                    <p className="text-sm text-muted">Añade una capa extra de seguridad</p>
                  </div>
                  <button id="enable-2fa-btn" className="btn btn-secondary btn-sm">Activar</button>
                </div>
                <div className="security-row">
                  <div>
                    <p className="font-semibold text-sm">Sesiones activas</p>
                    <p className="text-sm text-muted">1 sesión activa en este dispositivo</p>
                  </div>
                  <button id="manage-sessions-btn" className="btn btn-secondary btn-sm">Gestionar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {saved && (
          <div className="alert alert-success animate-slide-in-right" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, boxShadow: 'var(--shadow-lg)' }}>
            <CheckCircle2 size={18} />
            <span>Perfil actualizado exitosamente.</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
