// Archivo principal de JavaScript
// IMPORTANTE: Asegúrate de que PHP está corriendo. Si abres este HTML con LiveServer, 
// pon aquí la URL de tu servidor PHP local (ej: http://localhost:8000/api.php)
// Si ambos corren en el mismo servidor (php -S localhost:8000), basta con 'api.php'
const API_URL = 'api.php';

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.getElementById('formUser').addEventListener('submit', createUser);
    document.getElementById('formPost').addEventListener('submit', createPost);
});

// Función para mostrar alertas
function showAlert(message, type = 'success') {
    const alertsDiv = document.getElementById('alerts');
    alertsDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    setTimeout(() => {
        alertsDiv.innerHTML = '';
    }, 4000);
}

// Cargar todos los usuarios y posts
async function loadData() {
    try {
        const response = await fetch(`${API_URL}?action=get_all`);
        const data = await response.json();
        
        if (data.success) {
            renderUsers(data.users);
            renderPosts(data.posts);
            populateUserSelect(data.users);
        } else {
            showAlert(data.message || data.error, 'danger');
        }
    } catch (error) {
        console.error('Error cargando datos. ¿Está PHP corriendo en localhost:8000?', error);
        showAlert('No se pudo conectar al servidor PHP. ¿Aseguraste de ejecutar "php -S localhost:8000"?', 'danger');
    }
}

// Renderizar tabla de usuarios
function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    if(users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay usuarios</td></tr>';
        return;
    }

    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${user.name}</strong></td>
                <td><small>${user.email}</small></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${user.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Renderizar tabla de posts
function renderPosts(posts) {
    const tbody = document.getElementById('postsTableBody');
    tbody.innerHTML = '';

    if(posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay posts publicados</td></tr>';
        return;
    }

    posts.forEach(post => {
        const authorName = post.user ? post.user.name : 'Desconocido';
        tbody.innerHTML += `
            <tr>
                <td><strong>${post.title}</strong><br><small class="text-muted">${post.content}</small></td>
                <td><span class="badge bg-secondary">${authorName}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePost('${post.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Llenar select de usuarios para el formulario de posts
function populateUserSelect(users) {
    const select = document.getElementById('postUserId');
    select.innerHTML = '<option value="">Selecciona el autor...</option>';
    users.forEach(user => {
        select.innerHTML += `<option value="${user.id}">${user.name}</option>`;
    });
}

// Crear un usuario
async function createUser(e) {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create_user', name, email })
        });
        const data = await response.json();
        
        if (data.success) {
            showAlert('Usuario registrado correctamente');
            document.getElementById('formUser').reset();
            loadData();
        } else {
            showAlert('Error: ' + (data.error || 'No se pudo crear'), 'danger');
        }
    } catch (error) {
        showAlert('Error de conexión', 'danger');
    }
}

// Crear un post
async function createPost(e) {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const user_id = document.getElementById('postUserId').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create_post', title, content, user_id })
        });
        const data = await response.json();
        
        if (data.success) {
            showAlert('Post publicado correctamente');
            document.getElementById('formPost').reset();
            loadData();
        } else {
            showAlert('Error: ' + (data.error || 'No se pudo crear'), 'danger');
        }
    } catch (error) {
        showAlert('Error de conexión', 'danger');
    }
}

// Eliminar usuario
window.deleteUser = async function(id) {
    if(!confirm('¿Estás seguro de eliminar este usuario? Sus posts también se eliminarán.')) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_user', id })
        });
        const data = await response.json();
        
        if (data.success) {
            showAlert('Usuario eliminado');
            loadData();
        }
    } catch (error) {
        showAlert('Error de conexión', 'danger');
    }
}

// Eliminar post
window.deletePost = async function(id) {
    if(!confirm('¿Estás seguro de eliminar este post?')) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_post', id })
        });
        const data = await response.json();
        
        if (data.success) {
            showAlert('Post eliminado');
            loadData();
        }
    } catch (error) {
        showAlert('Error de conexión', 'danger');
    }
}
