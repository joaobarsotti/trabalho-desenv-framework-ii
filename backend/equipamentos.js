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

document.getElementById('deleteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const deleteId = document.getElementById('deleteId').value;
    const resultDiv = document.getElementById('deleteResult');
    resultDiv.innerHTML = '';

    if (!deleteId) return;

    if (!confirm(`TEM CERTEZA que deseja EXCLUIR o equipamento com ID: ${deleteId}?`)) {
        resultDiv.innerHTML = '<p>Operação cancelada.</p>';
        resultDiv.className = 'message success';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/equipments/${deleteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) { 
            showMessage(`Equipamento ID ${deleteId} excluído com sucesso!`, 'success');
            resultDiv.innerHTML = `<p>Equipamento ID ${deleteId} excluído com sucesso!</p>`;
            resultDiv.className = 'message success';
            loadEquipments(); 
        } else if (response.status === 404) {
            const errorData = await response.json();
            resultDiv.innerHTML = `<h4>Erro na Exclusão</h4><p>${errorData.error || 'Equipamento não encontrado.'}</p>`;
            resultDiv.className = 'message error';
        } else {
            try {
                const errorData = await response.json();
                showMessage(errorData.error || `Erro (${response.status}) ao excluir`, 'error');
            } catch (e) {
                showMessage(`Erro no servidor: ${response.status}.`, 'error');
            }
        }

    } catch (error) {
        showMessage('Falha crítica de conexão com a API.', 'error');
        resultDiv.className = 'message error';
        resultDiv.innerHTML = 'Falha ao conectar com a API.';
    }
});

async function loadEquipments() {
    try {
        const response = await fetch(`${API_URL}/equipments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            logout();
            return;
        }

        const equipments = await response.json();
        const tbody = document.getElementById('equipmentsBody');
        document.getElementById('tableHeader').style.display = 'table-header-group';
        tbody.innerHTML = '';
    
        if (equipments.length === 0) {
            showMessage('Nenhum equipamento cadastrado.', 'info');
            return;
        }

        equipments.forEach(equipment => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${equipment.name}</td>
                <td>${equipment.category}</td>
                <td>${equipment.serialNumber}</td>
                <td>${equipment.value}</td>`;
                tbody.appendChild(tr);
            });
        } catch (error) {
                showMessage('Erro ao carregar equipamentos', 'error');
            }
}

document.getElementById('equipmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        serialNumber: document.getElementById('serialNumber').value,
        purchaseDate: document.getElementById('purchaseDate').value,
        value: document.getElementById('value').value
    };

    try {
        const url = editingId 
        ? `${API_URL}/equipments/${editingId}`
        : `${API_URL}/equipments`;
                
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showMessage(editingId ? 'Equipamento atualizado com sucesso!' : 'Equipamento cadastrado com sucesso!', 'success');
            resetForm();
            loadEquipments();
        } else {
            try {
                const errorData = await response.json();
                showMessage(errorData.error || `Erro (${response.status}) ao salvar`, 'error');
            } catch (e) {
                showMessage(`Erro no servidor: ${response.status}. Verifique o console.`, 'error');
            }
        }
    } catch (error) {
        showMessage('Falha crítica de conexão com a API.', 'error');
        console.error("Falha no Fetch:", error);
    }
});

async function editEquipment(id) {
    try {
        const response = await fetch(`${API_URL}/equipments/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
                }
            });

            const equipment = await response.json();
                
            editingId = id;
            document.getElementById('formTitle').textContent = 'Editar Equipamento';
            document.getElementById('name').value = equipment.name;
            document.getElementById('category').value = equipment.category;
            document.getElementById('serialNumber').value = equipment.serialNumber;
            document.getElementById('purchaseDate').value = equipment.purchaseDate ? equipment.purchaseDate.split('T')[0] : '';
            document.getElementById('value').value = equipment.value || '';

            document.getElementById('equipmentId').value = equipment.id;
                window.scrollTo(0, 0);
        } catch (error) {
            showMessage('Erro ao carregar equipamento', 'error');
        }
}
document.getElementById('loadForEditForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const editLoadId = document.getElementById('editLoadId').value;
    const resultDiv = document.getElementById('loadResult');
    resultDiv.innerHTML = '';

    if (!editLoadId) return;

    try {
        await editEquipment(editLoadId);
        resultDiv.innerHTML = `<p class="message success" style="display:block;">Dados do ID ${editLoadId} carregados no formulário acima.</p>`;
    } catch (error) {
        resultDiv.innerHTML = `<p class="message error" style="display:block;">Erro: Equipamento ID ${editLoadId} não encontrado.</p>`;
    }
});

async function deleteEquipment(id) {
    if (!confirm('Tem certeza que deseja excluir este equipamento?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/equipments/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showMessage('Equipamento excluído com sucesso!', 'success');
            loadEquipments();
        } else {
            showMessage('Erro ao excluir equipamento', 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
    }
}

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchId = document.getElementById('searchId').value;
    const resultDiv = document.getElementById('searchResult');
    resultDiv.innerHTML = '';

    if (!searchId) return;

    try {
        const response = await fetch(`${API_URL}/equipments/${searchId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            logout();
            return;
        }
        
        let data = {};
        try {
            data = await response.json();
        } catch (e) {
        }

        if (response.ok) {
            const equipment = data;
            resultDiv.innerHTML = `
                <h4>Detalhes do Equipamento #${equipment.id}</h4>
                <p><strong>Nome:</strong> ${equipment.name}</p>
                <p><strong>Número de Série:</strong> ${equipment.serialNumber}</p>
                <p><strong>Valor:</strong> ${equipment.value}</p>
            `;
            resultDiv.className = 'message success';
            resultDiv.style.display = 'block';
        } else if (response.status === 404) {
            resultDiv.innerHTML = `<h4>Erro na Busca</h4><p>${data.error || 'Equipamento não encontrado.'}</p>`;
            resultDiv.className = 'message error';
            resultDiv.style.display = 'block';
        } else {
            resultDiv.innerHTML = `<h4>Erro no Servidor</h4><p>${data.error || `Erro desconhecido (${response.status})`}</p>`;
            resultDiv.className = 'message error';
        }

    } catch (error) {
        showMessage('Falha crítica de conexão com a API.', 'error');
        resultDiv.className = 'message error';
        resultDiv.innerHTML = 'Falha ao conectar com a API.';
    }
});

function resetForm() {
    editingId = null;
    document.getElementById('formTitle').textContent = 'Cadastrar Novo Equipamento';
    document.getElementById('equipmentForm').reset();
    document.getElementById('tableHeader').style.display = 'none';
}