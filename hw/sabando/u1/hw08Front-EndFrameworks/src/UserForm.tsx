
import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { UserData } from './types';

interface UserFormProps {
  onAddUser: (user: UserData) => Promise<void>;
}

export const UserForm = ({ onAddUser }: UserFormProps) => {
  const [formData, setFormData] = useState<UserData>({
    name: '', email: '', password: '', lastname: '', username: '', ruc: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await onAddUser(formData);
    setLoading(false);
    setFormData({ name: '', email: '', password: '', lastname: '', username: '', ruc: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Register New User</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="First Name *" required style={{ width: '100%', padding: '8px' }} />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Last Name" style={{ width: '100%', padding: '8px' }}/>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" style={{ width: '100%', padding: '8px' }}/>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" required style={{ width: '100%', padding: '8px' }}/>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password *" required style={{ width: '100%', padding: '8px' }}/>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="ruc" value={formData.ruc} onChange={handleChange} placeholder="RUC (Tax ID)" style={{ width: '100%', padding: '8px' }}/>
      </div>

      <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: loading ? '#ccc' : '#0078d4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '10px' }}>
        {loading ? 'Saving...' : 'Save User'}
      </button>
    </form>
  );
};