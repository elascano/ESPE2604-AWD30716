import { useState } from 'react';
import { LifeBuoy, Send, CheckCircle2, AlertCircle, MessageSquare, Phone, Mail } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/Support.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface SupportFormState {
  subject: string;
  category: string;
  priority: string;
  description: string;
}

interface SupportFormErrors {
  subject?: string;
  category?: string;
  description?: string;
  submit?: string;
}

export default function SupportPage() {
  const { currentUser } = useAuth();
  const [formState, setFormState] = useState<SupportFormState>({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
  });
  const [errors, setErrors] = useState<SupportFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: SupportFormErrors = {};
    if (!formState.subject.trim()) newErrors.subject = 'Ingresa el asunto del problema';
    if (!formState.category) newErrors.category = 'Selecciona una categoría';
    if (!formState.description.trim()) newErrors.description = 'Describe tu problema';
    else if (formState.description.trim().length < 20) newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/support/tickets`, {
        ...formState,
        userId: currentUser?.id
      });
      
      if (response.data.success) {
        setSubmitted(true);
      } else {
        setErrors({ submit: response.data.message || 'Error al enviar el ticket' });
      }
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Error de conexión con el servidor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof SupportFormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormState(prev => ({ ...prev, [field]: event.target.value }));
    if (errors[field as keyof SupportFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Centro de Soporte</h1>
        <p className="page-subtitle">¿Tienes algún problema o consulta? Nuestro equipo está listo para ayudarte</p>

        <div className="support-layout">
          <div className="support-form-section">
            {submitted ? (
              <div className="card">
                <div className="support-success-state">
                  <div className="support-success-icon">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2>¡Ticket enviado exitosamente!</h2>
                  <p className="text-muted">
                    Tu solicitud ha sido registrada. Recibirás una respuesta en tu correo electrónico en un plazo de 24 a 48 horas hábiles.
                  </p>
                  <div className="ticket-reference">
                    <span className="text-sm text-muted">Número de ticket:</span>
                    <span className="ticket-number">#TKT-2025-0047</span>
                  </div>
                  <button
                    id="new-ticket-btn"
                    className="btn btn-secondary"
                    onClick={() => { setSubmitted(false); setFormState({ subject: '', category: '', priority: 'medium', description: '' }); }}
                  >
                    Crear nuevo ticket
                  </button>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center gap-8">
                    <LifeBuoy size={18} className="text-primary" />
                    <h2 className="card-title">Nuevo Ticket de Soporte</h2>
                  </div>
                </div>
                <div className="card-body">
                  <form id="support-form" onSubmit={handleSubmit} className="flex flex-col gap-16" noValidate>
                    {errors.submit && (
                      <div className="alert alert-danger p-12 mb-16 rounded-md">
                        <AlertCircle size={14} className="inline mr-8" />
                        <span className="text-sm">{errors.submit}</span>
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor="support-subject" className="form-label">Asunto</label>
                      <input
                        id="support-subject"
                        type="text"
                        className={`form-input ${errors.subject ? 'error' : ''}`}
                        placeholder="Describe brevemente tu problema"
                        value={formState.subject}
                        onChange={handleChange('subject')}
                      />
                      {errors.subject && <span className="form-error"><AlertCircle size={13} />{errors.subject}</span>}
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label htmlFor="support-category" className="form-label">Categoría</label>
                        <select
                          id="support-category"
                          className={`form-select ${errors.category ? 'error' : ''}`}
                          value={formState.category}
                          onChange={handleChange('category')}
                        >
                          <option value="">Selecciona una categoría</option>
                          <option value="sri-connection">Conexión con SRI</option>
                          <option value="invoice-download">Descarga de facturas</option>
                          <option value="ats-generation">Generación de ATS</option>
                          <option value="xml-export">Exportación XML</option>
                          <option value="account">Cuenta y acceso</option>
                          <option value="other">Otro</option>
                        </select>
                        {errors.category && <span className="form-error"><AlertCircle size={13} />{errors.category}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="support-priority" className="form-label">Prioridad</label>
                        <select
                          id="support-priority"
                          className="form-select"
                          value={formState.priority}
                          onChange={handleChange('priority')}
                        >
                          <option value="low">Baja - consulta general</option>
                          <option value="medium">Media - afecta mi trabajo</option>
                          <option value="high">Alta - bloquea mi declaración</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="support-description" className="form-label">Descripción del problema</label>
                      <textarea
                        id="support-description"
                        className={`form-textarea ${errors.description ? 'error' : ''}`}
                        placeholder="Describe detalladamente el problema que estás experimentando. Incluye pasos para reproducirlo si es posible."
                        value={formState.description}
                        onChange={handleChange('description')}
                        rows={5}
                      />
                      <span className="form-hint">{formState.description.length} / mínimo 20 caracteres</span>
                      {errors.description && <span className="form-error"><AlertCircle size={13} />{errors.description}</span>}
                    </div>

                    <button
                      id="submit-support-btn"
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <><span className="spinner" />Enviando...</> : <><Send size={16} />Enviar Ticket</>}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="support-info-section">
            <div className="card mb-16">
              <div className="card-header"><h3 className="card-title">Contacto directo</h3></div>
              <div className="card-body flex flex-col gap-16">
                {[
                  { icon: <Mail size={18} />, label: 'Correo', value: 'soporte@atsexpress.ec', color: 'blue' },
                  { icon: <Phone size={18} />, label: 'Teléfono', value: '+593 2 234-5678', color: 'green' },
                  { icon: <MessageSquare size={18} />, label: 'Chat en vivo', value: 'Lun-Vie 8:00 - 18:00', color: 'purple' },
                ].map(contact => (
                  <div key={contact.label} className={`contact-item contact-item-${contact.color}`}>
                    <div className={`contact-icon contact-icon-${contact.color}`}>{contact.icon}</div>
                    <div>
                      <p className="text-xs text-muted">{contact.label}</p>
                      <p className="text-sm font-semibold">{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-16">
              <div className="card-header"><h3 className="card-title">Preguntas frecuentes</h3></div>
              <div className="card-body flex flex-col gap-12">
                {[
                  { q: '¿Cómo conecto mi cuenta SRI?', a: 'Ve a "Conectar SRI" en el menú y sigue el proceso de vinculación.' },
                  { q: '¿En qué formato deben estar las facturas?', a: 'El sistema acepta facturas en formato XML y PDF descargadas del SRI.' },
                  { q: '¿Puedo declarar para más de un contribuyente?', a: 'Cada RUC debe tener su propia cuenta. No se mezclan facturas de diferentes contribuyentes (RN-02).' },
                ].map((faq, index) => (
                  <details key={index} className="faq-item">
                    <summary className="faq-question">{faq.q}</summary>
                    <p className="faq-answer">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3 className="card-title">Mis tickets recientes</h3></div>
              <div className="card-body">
                <div className="empty-state" style={{ padding: '20px 0' }}>
                  <div className="empty-state-icon" style={{ width: 40, height: 40 }}><LifeBuoy size={18} /></div>
                  <p className="empty-state-title" style={{ fontSize: '0.875rem' }}>Sin tickets anteriores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
