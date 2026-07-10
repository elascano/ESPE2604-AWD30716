import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    RUC: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { completeProfile } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('incompleteUser');
    if (!stored) {
      navigate('/login');
    } else {
      const incompleteUser = JSON.parse(stored);
      setFormData(prev => ({
        ...prev,
        firstName: incompleteUser.firstName || '',
        firstLastName: incompleteUser.lastName || '',
      }));
    }
  }, [navigate]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setGeneralError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'El primer nombre es obligatorio';
    if (!formData.firstLastName) newErrors.firstLastName = 'El primer apellido es obligatorio';
    if (!formData.RUC) newErrors.RUC = 'El RUC es obligatorio';
    else if (!/^\d{13}$/.test(formData.RUC)) newErrors.RUC = 'El RUC debe tener 13 dígitos numéricos';
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const success = await completeProfile(formData);
    if (success) {
      navigate('/dashboard');
    } else {
      setGeneralError('Error al guardar el perfil. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-background-blob blob-1" />
        <div className="auth-background-blob blob-2" />
      </div>

      <div className="auth-container register-container">
        <div className="auth-brand">
          <Link to="/" className="auth-logo-link">
            <div className="auth-logo">
              <Building2 size={24} color="white" />
            </div>
            <span className="auth-brand-name">ATS Express</span>
          </Link>
        </div>

        <div className="auth-card animate-scale-in">
          <div className="auth-card-header">
            <h1 className="auth-title">Completar Perfil</h1>
            <p className="auth-subtitle">Necesitamos algunos datos adicionales para configurar tu cuenta.</p>
          </div>

          {generalError && (
            <div className="alert alert-danger mb-16" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'var(--color-danger-50)', color: 'var(--color-danger-500)', borderRadius: 'var(--radius-md)' }}>
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label"><User size={14} /> Primer Nombre *</label>
                <input
                  type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label"><User size={14} /> Segundo Nombre</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Carlos"
                  value={formData.secondName}
                  onChange={handleChange('secondName')}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label"><User size={14} /> Primer Apellido *</label>
                <input
                  type="text"
                  className={`form-input ${errors.firstLastName ? 'error' : ''}`}
                  value={formData.firstLastName}
                  onChange={handleChange('firstLastName')}
                />
                {errors.firstLastName && <span className="form-error">{errors.firstLastName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label"><User size={14} /> Segundo Apellido</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Gómez"
                  value={formData.secondLastName}
                  onChange={handleChange('secondLastName')}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><Building2 size={14} /> Número de RUC *</label>
              <input
                type="text"
                className={`form-input ${errors.RUC ? 'error' : ''}`}
                placeholder="1790000000001"
                value={formData.RUC}
                onChange={handleChange('RUC')}
                maxLength={13}
              />
              {errors.RUC && <span className="form-error">{errors.RUC}</span>}
            </div>

            <div className="form-group">
              <label className="form-label"><Calendar size={14} /> Fecha de Nacimiento *</label>
              <input
                type="date"
                className={`form-input ${errors.birthDate ? 'error' : ''}`}
                value={formData.birthDate}
                onChange={handleChange('birthDate')}
              />
              {errors.birthDate && <span className="form-error">{errors.birthDate}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : 'Guardar y Continuar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
