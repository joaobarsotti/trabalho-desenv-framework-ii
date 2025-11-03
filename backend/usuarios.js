const API_URL = 'http://localhost:8000/api';
let token = sessionStorage.getItem('token'); 
let editingId = null;

if (!token) {
    window.location.href = 'login.html';
}

const user = JSON.parse(sessionStorage.getItem('user'));
document.getElementById('userName').textContent = `Olá, ${user.name}`;

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        const users = await response.json();
        const tbody = document.getElementById('usersBody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editUser(${user.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        showMessage('Erro ao carregar usuários', 'error');
    }
}

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const url = editingId 
            ? `${API_URL}/users/${editingId}`
            : `${API_URL}/users`;
        
        const method = editingId ? 'PUT' : 'POST';

        if (editingId && !data.password) {
            delete data.password;
        }

        if (data.password && data.password.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }
        
        if (method === 'POST' && !data.password) {
            showMessage('A senha é obrigatória para o cadastro.', 'error');
            return;
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showMessage(editingId ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!', 'success');
            resetForm();
            loadUsers();
        } else {
            const error = await response.json();
            showMessage(error.error || 'Erro ao salvar usuário. Verifique se o Email já está em uso.', 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
    }
});

async function editUser(id) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const user = await response.json();
        
        editingId = id;
        document.getElementById('formTitle').textContent = 'Editar Usuário';
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('password').value = ''; 
        document.getElementById('password').placeholder = 'Deixe em branco para não alterar a senha';

        window.scrollTo(0, 0);
    } catch (error) {
        showMessage('Erro ao carregar usuário', 'error');
    }
}

async function deleteUser(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showMessage('Usuário excluído com sucesso!', 'success');
            loadUsers();
        } else {
            showMessage('Erro ao excluir usuário', 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
    }
}

function resetForm() {
    editingId = null;
    document.getElementById('formTitle').textContent = 'Cadastrar Novo Usuário';
    document.getElementById('password').placeholder = '';
    document.getElementById('userForm').reset();
}

loadUsers();