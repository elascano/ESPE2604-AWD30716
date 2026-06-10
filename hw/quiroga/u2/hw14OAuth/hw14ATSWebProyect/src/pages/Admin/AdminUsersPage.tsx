import { useState, useEffect } from 'react';
import { Users, Search, Edit2, Trash2, Plus, Shield, UserCheck, X, AlertCircle } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import type { User } from '../../types';
import axios from 'axios';
import '../../styles/AdminUsers.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function isValidRuc(ruc: string): boolean {
  return /^\d{13}$/.test(ruc);
}

function isValidName(name: string): boolean {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name);
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [formData, setFormData] = useState({
    ruc: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingUserId(null);
    setFormData({ ruc: '', firstName: '', lastName: '', email: '', password: '' });
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setIsEditing(true);
    setEditingUserId(user.id);
    setFormData({ ruc: user.ruc, firstName: user.firstName, lastName: user.lastName, email: user.email, password: '' });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
      const response = await axios.post(`${API_URL}/users/delete`, { id });
      if (response.data.success) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert(response.data.message || 'Error al eliminar el usuario');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setModalError('Los nombres, apellidos y correo son obligatorios');
      setIsSubmitting(false);
      return;
    }

    if (!isEditing && (!formData.ruc || !formData.password)) {
      setModalError('Todos los campos son obligatorios para el registro');
      setIsSubmitting(false);
      return;
    }

    if (!isEditing && !isValidRuc(formData.ruc)) {
      setModalError('El RUC debe tener 13 dígitos numéricos');
      setIsSubmitting(false);
      return;
    }

    if (!isValidName(formData.firstName) || !isValidName(formData.lastName)) {
      setModalError('El nombre y apellido no deben contener números ni símbolos');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        const response = await axios.post(`${API_URL}/users/update`, {
          id: editingUserId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        });
        if (response.data.success) {
          setUsers(users.map(u => u.id === editingUserId ? { ...u, firstName: formData.firstName, lastName: formData.lastName, email: formData.email } : u));
          setIsModalOpen(false);
        }
      } else {
        const response = await axios.post(`${API_URL}/users/register`, formData);
        if (response.data.success) {
          setUsers([response.data.data, ...users]);
          setIsModalOpen(false);
        }
      }
    } catch (error: any) {
      setModalError(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.ruc.includes(searchQuery) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="page-title">Gestión de Usuarios</h1>
        <p className="page-subtitle">Administra los usuarios registrados en la plataforma ATS Express</p>

        <div className="users-toolbar mb-24">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              id="user-search"
              type="text"
              className="form-input search-input"
              placeholder="Buscar por nombre, RUC o correo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button id="add-user-btn" className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={16} />Agregar Usuario
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-8">
              <Users size={18} className="text-primary" />
              <h2 className="card-title">Usuarios registrados</h2>
            </div>
            <span className="badge badge-info">{filteredUsers.length} usuarios</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>RUC</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Fecha registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">Cargando usuarios...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">No se encontraron usuarios.</td>
                  </tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-10">
                        <div className="user-row-avatar">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm font-medium">{user.ruc}</td>
                    <td className="text-sm text-muted">{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                        {user.role === 'admin' ? <><Shield size={12} />Admin</> : <><UserCheck size={12} />Contador</>}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{new Date(user.createdAt).toLocaleDateString('es-EC')}</td>
                    <td>
                      <div className="flex gap-4">
                        <button className="btn btn-ghost btn-sm" aria-label="Editar usuario" onClick={() => openEditModal(user)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm text-danger" aria-label="Eliminar usuario" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal animate-scale-in" style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h3 className="modal-title">{isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmitUser} className="modal-body">
                {modalError && (
                  <div className="alert alert-danger mb-16 py-8">
                    <AlertCircle size={14} />
                    <span className="text-sm">{modalError}</span>
                  </div>
                )}
                <div className="grid-2 mb-16">
                  <div className="form-group">
                    <label className="form-label text-sm">Nombres</label>
                    <input type="text" className="form-input" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-sm">Apellidos</label>
                    <input type="text" className="form-input" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group mb-16">
                  <label className="form-label text-sm">Número de RUC</label>
                  <input type="text" className="form-input" maxLength={13} value={formData.ruc} onChange={e => setFormData({...formData, ruc: e.target.value})} disabled={isEditing} required={!isEditing} />
                </div>
                <div className="form-group mb-16">
                  <label className="form-label text-sm">Correo Electrónico</label>
                  <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group mb-24">
                  <label className="form-label text-sm">Contraseña Temporal</label>
                  <input type="text" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={isEditing ? 'No modificable aquí' : 'Mínimo 8 caracteres'} disabled={isEditing} required={!isEditing} />
                </div>
                <div className="flex gap-12 justify-end">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Crear Usuario')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
