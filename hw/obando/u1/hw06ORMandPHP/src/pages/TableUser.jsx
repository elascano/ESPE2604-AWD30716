import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TableUser.css';

function TableUser() {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', lastname: '', email: '' });

    const getCustomers = async () => {
        try {
            const response = await fetch('/api/customers');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    }

    const deleteCustomer = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) return;
        try {
            const response = await fetch(`/api/customers/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setUsers(users.filter(user => user._id !== id));
            } else {
                console.error('Error al eliminar');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const startEdit = (user) => {
        setEditingId(user._id);
        setEditForm({ name: user.name, lastname: user.lastname, email: user.email });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', lastname: '', email: '' });
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const saveEdit = async (id) => {
        try {
            const response = await fetch(`/api/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(users.map(user => (user._id === id ? data.customer : user)));
                setEditingId(null);
            } else {
                console.error('Error al actualizar');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <div className="table-container">
            <div className="table-header">
                <h1>Clientes</h1>
                <Link to="/" className="back-btn">
                    Volver al Formulario
                </Link>
            </div>
            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    {editingId === user._id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td>
                                    {editingId === user._id ? (
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={editForm.lastname}
                                            onChange={handleEditChange}
                                        />
                                    ) : (
                                        user.lastname
                                    )}
                                </td>
                                <td>
                                    {editingId === user._id ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleEditChange}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {editingId === user._id ? (
                                        <>
                                            <button onClick={() => saveEdit(user._id)} className="action-btn save">Guardar</button>
                                            <button onClick={cancelEdit} className="action-btn cancel">Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEdit(user)} className="action-btn edit">Editar</button>
                                            <button onClick={() => deleteCustomer(user._id)} className="action-btn delete">Eliminar</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default TableUser;