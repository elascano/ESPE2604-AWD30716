import { useState } from 'react';
import { Save, Shield, Database, Bell, CheckCircle2 } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Configuración del Sistema</h1>
        <p className="page-subtitle">Ajustes globales y preferencias administrativas</p>

        <div className="grid-2 mt-24">
          <div className="card">
            <div className="card-header border-b pb-12 mb-16">
              <div className="flex items-center gap-8">
                <Shield size={18} className="text-primary" />
                <h2 className="font-semibold">Seguridad</h2>
              </div>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Forzar contraseñas seguras para todos los usuarios</span>
              </label>
            </div>
            <div className="form-group mt-12">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Habilitar bloqueo tras 5 intentos fallidos</span>
              </label>
            </div>
          </div>

          <div className="card">
            <div className="card-header border-b pb-12 mb-16">
              <div className="flex items-center gap-8">
                <Database size={18} className="text-primary" />
                <h2 className="font-semibold">Base de Datos</h2>
              </div>
            </div>
            <p className="text-sm text-muted mb-16">
              Opciones de retención de archivos ATS y documentos tributarios.
            </p>
            <div className="form-group">
              <label className="form-label">Tiempo de retención de ATS (Meses)</label>
              <select className="form-input">
                <option value="12">12 Meses</option>
                <option value="24">24 Meses</option>
                <option value="36">36 Meses</option>
                <option value="60">60 Meses (5 Años - Recomendado SRI)</option>
              </select>
            </div>
          </div>

          <div className="card md:col-span-2 mt-8">
            <div className="card-header border-b pb-12 mb-16">
              <div className="flex items-center gap-8">
                <Bell size={18} className="text-primary" />
                <h2 className="font-semibold">Notificaciones Globales</h2>
              </div>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Notificar a los admins cuando un usuario registre su RUC</span>
              </label>
            </div>
            <div className="form-group mt-12">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Enviar alertas semanales de comprobantes no procesados</span>
              </label>
            </div>
            <div className="mt-24 text-right">
              <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <><span className="spinner" />Guardando...</> : <><Save size={16} /> Guardar Configuración</>}
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {saved && (
          <div className="alert alert-success animate-slide-in-right" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, boxShadow: 'var(--shadow-lg)' }}>
            <CheckCircle2 size={18} />
            <span>Configuración global guardada exitosamente.</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
