
import { useState, useEffect } from 'react';
import { UserForm } from './UserForm';
import { UserList } from './UserList';
import type { UserData } from './types';

const API_URL = 'https://orm-pkez.onrender.com';

function App() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/get_users.php`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setUsers(result.data);
      } else {
        // Si PHP devuelve un error (como el de la contraseña), lo mostramos
        console.error("Error del servidor:", result.message);
        setNotification({ message: `Error loading users: ${result.message}`, type: 'error' });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setNotification({ message: 'Network error while loading users.', type: 'error' });
    }
  };onabort

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (newUser: UserData) => {
    try {
      const formData = new FormData();
      Object.keys(newUser).forEach(key => {
        formData.append(key, newUser[key as keyof UserData] as string);
      });

      const response = await fetch(`${API_URL}/register.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        setNotification({ message: 'User registered successfully!', type: 'success' });
        fetchUsers(); 
      } else {
        setNotification({ message: result.message, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'Server connection error.', type: 'error' });
    }
    
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>User Management</h1>
      
      {notification && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '4px', 
          backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
          color: notification.type === 'success' ? '#155724' : '#721c24',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {notification.message}
        </div>
      )}

      <UserForm onAddUser={handleAddUser} />
      <UserList users={users} />
    </div>
  );
}

export default App;