import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2, User, Mail, Calendar, Hash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

interface RegisterFormState {
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  ruc: string;
  email: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface RegisterFormErrors {
  firstName?: string;
  secondName?: string;
  firstLastName?: string;
  secondLastName?: string;
  ruc?: string;
  email?: string;
  birthDate?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

const RUC_LENGTH = 13;
const MIN_PASSWORD_LENGTH = 8;

function isValidRuc(ruc: string): boolean {
  return /^\d{13}$/.test(ruc);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidName(name: string): boolean {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name);
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<RegisterFormState>({
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    ruc: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};
    if (!formState.firstName.trim()) newErrors.firstName = 'Ingresa tu primer nombre';
    else if (!isValidName(formState.firstName)) newErrors.firstName = 'El primer nombre no debe contener números ni símbolos';
    if (!formState.firstLastName.trim()) newErrors.firstLastName = 'Ingresa tu primer apellido';
    else if (!isValidName(formState.firstLastName)) newErrors.firstLastName = 'El primer apellido no debe contener números ni símbolos';
    if (!formState.ruc.trim()) newErrors.ruc = 'Ingresa tu RUC';
    else if (!isValidRuc(formState.ruc)) newErrors.ruc = `El RUC debe tener ${RUC_LENGTH} dígitos numéricos`;
    if (!formState.email.trim()) newErrors.email = 'Ingresa tu correo electrónico';
    else if (!isValidEmail(formState.email)) newErrors.email = 'Ingresa un correo electrónico válido';
    if (!formState.birthDate) newErrors.birthDate = 'Ingresa tu fecha de nacimiento';
    if (!formState.password) newErrors.password = 'Ingresa una contraseña';
    else if (formState.password.length < MIN_PASSWORD_LENGTH) newErrors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
    if (!formState.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (formState.password !== formState.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!formState.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const success = await register({
        RUC: formState.ruc,
        firstName: formState.firstName,
        secondName: formState.secondName,
        firstLastName: formState.firstLastName,
        secondLastName: formState.secondLastName,
        email: formState.email,
        birthDate: formState.birthDate,
        password: formState.password
      });
      if (success) navigate('/workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof RegisterFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormState(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof RegisterFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const passwordStrength = (): { level: number; label: string; color: string } => {
    const pwd = formState.password;
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: 'Débil', color: 'var(--color-danger-500)' };
    if (score === 2) return { level: 2, label: 'Regular', color: 'var(--color-warning-500)' };
    if (score === 3) return { level: 3, label: 'Buena', color: 'var(--color-primary-500)' };
    return { level: 4, label: 'Excelente', color: 'var(--color-success-500)' };
  };

  const strength = passwordStrength();

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
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20M6 14h16M6 20h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="25" cy="22" r="5" fill="#10B981"/>
                <path d="M23 22l1.5 1.5L27 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="auth-brand-name">ATS Express</span>
          </Link>
        </div>

        <div className="auth-card animate-scale-in">
          <div className="auth-card-header">
            <h1 className="auth-title">Crear Cuenta</h1>
            <p className="auth-subtitle">Regístrate con tu RUC para comenzar</p>
          </div>

          {errors.general && (
            <div className="alert alert-danger mb-16">
              <AlertCircle size={16} />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="register-firstname" className="form-label">
                  <User size={14} /> Primer Nombre
                </label>
                <input
                  id="register-firstname"
                  type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Esteban"
                  value={formState.firstName}
                  onChange={handleChange('firstName')}
                />
                {errors.firstName && <span className="form-error"><AlertCircle size={13} />{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="register-secondname" className="form-label">Segundo Nombre</label>
                <input
                  id="register-secondname"
                  type="text"
                  className={`form-input ${errors.secondName ? 'error' : ''}`}
                  placeholder="Alejandro"
                  value={formState.secondName}
                  onChange={handleChange('secondName')}
                />
                {errors.secondName && <span className="form-error"><AlertCircle size={13} />{errors.secondName}</span>}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="register-firstlastname" className="form-label">Primer Apellido</label>
                <input
                  id="register-firstlastname"
                  type="text"
                  className={`form-input ${errors.firstLastName ? 'error' : ''}`}
                  placeholder="Quiroga"
                  value={formState.firstLastName}
                  onChange={handleChange('firstLastName')}
                />
                {errors.firstLastName && <span className="form-error"><AlertCircle size={13} />{errors.firstLastName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="register-secondlastname" className="form-label">Segundo Apellido</label>
                <input
                  id="register-secondlastname"
                  type="text"
                  className={`form-input ${errors.secondLastName ? 'error' : ''}`}
                  placeholder="Silva"
                  value={formState.secondLastName}
                  onChange={handleChange('secondLastName')}
                />
                {errors.secondLastName && <span className="form-error"><AlertCircle size={13} />{errors.secondLastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-ruc" className="form-label">
                <Hash size={14} /> Número de RUC
              </label>
              <input
                id="register-ruc"
                type="text"
                className={`form-input ${errors.ruc ? 'error' : ''}`}
                placeholder="1234567890001"
                value={formState.ruc}
                onChange={handleChange('ruc')}
                maxLength={13}
              />
              {errors.ruc && <span className="form-error"><AlertCircle size={13} />{errors.ruc}</span>}
              <span className="form-hint">El RUC debe tener 13 dígitos y ser único en el sistema</span>
            </div>

            <div className="form-group">
              <label htmlFor="register-email" className="form-label">
                <Mail size={14} /> Correo Electrónico
              </label>
              <input
                id="register-email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="ejemplo@correo.com"
                value={formState.email}
                onChange={handleChange('email')}
                autoComplete="email"
              />
              {errors.email && <span className="form-error"><AlertCircle size={13} />{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="register-birthdate" className="form-label">
                <Calendar size={14} /> Fecha de Nacimiento
              </label>
              <input
                id="register-birthdate"
                type="date"
                className={`form-input ${errors.birthDate ? 'error' : ''}`}
                value={formState.birthDate}
                onChange={handleChange('birthDate')}
              />
              {errors.birthDate && <span className="form-error"><AlertCircle size={13} />{errors.birthDate}</span>}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="register-password" className="form-label">Contraseña</label>
                <div className="input-password-wrapper">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Mínimo 8 caracteres"
                    value={formState.password}
                    onChange={handleChange('password')}
                    autoComplete="new-password"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {formState.password && (
                  <div className="password-strength">
                    <div className="password-strength-bar">
                      {[1,2,3,4].map(level => (
                        <div
                          key={level}
                          className="password-strength-segment"
                          style={{ background: level <= strength.level ? strength.color : 'var(--color-gray-200)' }}
                        />
                      ))}
                    </div>
                    <span className="password-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
                {errors.password && <span className="form-error"><AlertCircle size={13} />{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="register-confirm-password" className="form-label">Confirmar contraseña</label>
                <div className="input-password-wrapper">
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Repite tu contraseña"
                    value={formState.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    autoComplete="new-password"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="form-error"><AlertCircle size={13} />{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={formState.acceptTerms}
                  onChange={handleChange('acceptTerms')}
                />
                <span>Acepto los <a href="#" className="auth-link">Términos y Condiciones</a> y la <a href="#" className="auth-link">Política de Privacidad</a></span>
              </label>
              {errors.acceptTerms && <span className="form-error"><AlertCircle size={13} />{errors.acceptTerms}</span>}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? <><span className="spinner" />Creando cuenta...</> : <><CheckCircle2 size={16} />Crear Cuenta</>}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿Ya tienes una cuenta? <Link to="/login" className="auth-link">Inicia sesión aquí</Link>
          </p>
        </div>

        <p className="auth-copyright">© 2025 ATS Express. Sistema contable para Ecuador.</p>
      </div>
    </div>
  );
}
