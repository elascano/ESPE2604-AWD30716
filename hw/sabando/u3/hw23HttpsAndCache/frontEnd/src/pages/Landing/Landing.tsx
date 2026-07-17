import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileCode2,
  Shield,
  Clock,
  Zap,
  ArrowRight,
  Star,
  ChevronRight,
} from 'lucide-react';
import '../../styles/Landing.css';

const FEATURE_ITEMS = [
  {
    icon: <Download size={28} />,
    title: 'Descarga Automática',
    description: 'Conecta tu cuenta SRI y descarga todas tus facturas por período con un solo clic.',
    color: 'blue',
  },
  {
    icon: <FileSpreadsheet size={28} />,
    title: 'Genera ATS XLSM',
    description: 'Crea el Anexo Transaccional Simplificado en formato Excel Macro listo para revisar.',
    color: 'purple',
  },
  {
    icon: <CheckCircle2 size={28} />,
    title: 'Validación Inteligente',
    description: 'Detecta errores automáticamente antes de generar el XML final para el SRI.',
    color: 'green',
  },
  {
    icon: <FileCode2 size={28} />,
    title: 'Exporta en XML',
    description: 'Genera el archivo XML compatible con el DIMM del SRI, listo para declarar.',
    color: 'orange',
  },
];

const STATS = [
  { value: '+500', label: 'Contadores activos' },
  { value: '99.9%', label: 'Disponibilidad' },
  { value: '<5s', label: 'Generación de ATS' },
  { value: '0 errores', label: 'Tasa objetivo' },
];

const TESTIMONIALS = [
  {
    name: 'María González',
    role: 'Contadora CPA',
    company: 'González & Asociados',
    text: 'ATS Express redujo el tiempo de declaración de 3 horas a 15 minutos. Increíble herramienta.',
    rating: 5,
  },
  {
    name: 'Carlos Mendoza',
    role: 'Gerente Financiero',
    company: 'Distribuidora Norte S.A.',
    text: 'La validación automática me ayudó a evitar sanciones del SRI. Altamente recomendado.',
    rating: 5,
  },
  {
    name: 'Ana Torres',
    role: 'Contadora Independiente',
    company: 'Freelance',
    text: 'Manejo 12 empresas simultáneamente gracias a la automatización de ATS Express.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <div className="landing-logo">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20M6 14h16M6 20h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="25" cy="22" r="5" fill="#10B981"/>
                <path d="M23 22l1.5 1.5L27 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="landing-brand-name">ATS Express</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Características</a>
            <a href="#stats" className="landing-nav-link">Estadísticas</a>
            <a href="#testimonials" className="landing-nav-link">Testimonios</a>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-secondary btn-sm" id="landing-login-btn">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="landing-register-btn">
              Comenzar gratis
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Certificado bajo normativas SRI Ecuador 2025
        </div>
        <h1 className="hero-title">
          Automatiza tu<br />
          <span className="hero-title-accent">Declaración ATS</span><br />
          sin errores
        </h1>
        <p className="hero-description">
          La plataforma contable más avanzada de Ecuador. Descarga facturas del SRI,
          genera tu ATS en XLSM y exporta en XML listo para declarar, todo en minutos.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta-btn">
            Comenzar ahora <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg" id="hero-demo-btn">
            Ver demostración
          </Link>
        </div>
        <div className="hero-features">
          {['Conexión SRI segura', 'ATS XLSM automático', 'Exportación XML', 'Validación inteligente'].map((feature) => (
            <div key={feature} className="hero-feature-item">
              <CheckCircle2 size={16} className="hero-feature-icon" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span className="preview-dot red" />
                <span className="preview-dot yellow" />
                <span className="preview-dot green" />
              </div>
              <span className="preview-url">atsexpress.ec/dashboard</span>
            </div>
            <div className="preview-content">
              <div className="preview-stat-row">
                <div className="preview-stat blue">
                  <span className="preview-stat-value">247</span>
                  <span className="preview-stat-label">Facturas descargadas</span>
                </div>
                <div className="preview-stat green">
                  <span className="preview-stat-value">✓</span>
                  <span className="preview-stat-label">ATS listo</span>
                </div>
                <div className="preview-stat orange">
                  <span className="preview-stat-value">3</span>
                  <span className="preview-stat-label">Errores detectados</span>
                </div>
              </div>
              <div className="preview-progress-section">
                <p className="preview-progress-label">Progreso del proceso ATS</p>
                <div className="preview-steps">
                  {['Vincular SRI', 'Descargar', 'Cargar XML', 'Generar XLSM', 'Validar', 'Exportar XML'].map((step, index) => (
                    <div key={step} className={`preview-step ${index < 3 ? 'done' : index === 3 ? 'active' : 'pending'}`}>
                      <div className="preview-step-dot" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="hero-glow" />
        </div>
      </section>

      <section id="stats" className="stats-section">
        <div className="stats-inner">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-tag">Características</span>
          <h2 className="section-title">Todo lo que necesitas para declarar sin errores</h2>
          <p className="section-desc">
            Diseñado bajo las normativas del SRI Ecuador, con validaciones automáticas
            y un flujo de trabajo paso a paso.
          </p>
        </div>
        <div className="features-grid">
          {FEATURE_ITEMS.map((feature) => (
            <div key={feature.title} className={`feature-card feature-card-${feature.color}`}>
              <div className={`feature-icon feature-icon-${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
              <a href="#" className="feature-link">
                Saber más <ChevronRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-header">
          <span className="section-tag">Flujo de trabajo</span>
          <h2 className="section-title">De las facturas al XML en 6 pasos</h2>
        </div>
        <div className="workflow-steps">
          {[
            { step: '01', title: 'Regístrate con tu RUC', desc: 'Crea tu cuenta vinculada a tu número de RUC único.' },
            { step: '02', title: 'Conecta con SRI en línea', desc: 'Vincula tus credenciales del portal del SRI de forma segura.' },
            { step: '03', title: 'Descarga tus facturas', desc: 'Filtra por mes o semestre y descarga automáticamente.' },
            { step: '04', title: 'Genera el ATS XLSM', desc: 'El sistema crea el Anexo en formato Excel Macro.' },
            { step: '05', title: 'Valida y corrige', desc: 'Detecta y corrige errores con el log de validación.' },
            { step: '06', title: 'Exporta en XML', desc: 'Descarga el XML compatible con el DIMM del SRI.' },
          ].map((item, index) => (
            <div key={item.step} className="workflow-step">
              <div className="workflow-step-number">{item.step}</div>
              {index < 5 && <div className="workflow-connector" />}
              <h4 className="workflow-step-title">{item.title}</h4>
              <p className="workflow-step-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <span className="section-tag">Testimonios</span>
          <h2 className="section-title">Lo que dicen nuestros contadores</h2>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.name} className="testimonial-card">
              <div className="testimonial-stars">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role} · {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-badges">
            <div className="cta-badge"><Shield size={16} /> Datos protegidos TLS 1.3</div>
            <div className="cta-badge"><Clock size={16} /> Disponible 99.9% del tiempo</div>
            <div className="cta-badge"><Zap size={16} /> Generación en menos de 5s</div>
          </div>
          <h2 className="cta-title">¿Listo para declarar sin errores?</h2>
          <p className="cta-desc">
            Únete a más de 500 contadores que ya confían en ATS Express para sus declaraciones mensuales.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
            Crear cuenta gratuita <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="landing-logo">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path d="M6 8h20M6 14h16M6 20h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="25" cy="22" r="5" fill="#10B981"/>
              </svg>
            </div>
            <span className="footer-brand-name">ATS Express</span>
          </div>
          <p className="footer-copy">© 2025 ATS Express. Sistema contable para Ecuador.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Términos</a>
            <a href="#" className="footer-link">Privacidad</a>
            <Link to="/support" className="footer-link">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
