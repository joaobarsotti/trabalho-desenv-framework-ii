// backend/manutencoes.js

const API_URL = 'http://localhost:3000/api';
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

async function loadEquipments() {
    try {
        const response = await fetch(`${API_URL}/equipments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) { logout(); return; }

        let equipments = [];
       try {
            equipments = await response.json();
        } catch (e) {
            console.warn("API retornou sucesso sem corpo de dados para equipamentos.");
        }
        
        const select = document.getElementById('equipmentId');
        select.innerHTML = '<option value="">Selecione um equipamento</option>'; 

        equipments.forEach(equipment => {
            const option = document.createElement('option');
            option.value = equipment.id;
            option.textContent = `${equipment.name} (${equipment.serialNumber})`;
            select.appendChild(option);
        });
    } catch (error) {
        showMessage('Erro ao carregar equipamentos para seleção', 'error');
    }
}

async function loadMaintenances() {
    try {
        const response = await fetch(`${API_URL}/maintenances`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) { logout(); return; }

        const maintenances = await response.json(); 
        const tbody = document.getElementById('maintenancesBody');
        tbody.innerHTML = ''; 

        document.getElementById('maintenanceTableHeader').style.display = 'table-header-group';

        if (!Array.isArray(maintenances) || maintenances.length === 0) {
            showMessage('Nenhuma manutenção cadastrada.', 'info');
            return;
        }

        maintenances.forEach(maintenance => {
            const tr = document.createElement('tr');
            const statusClass = `status-${maintenance.status.replace(' ', '-')}`;
            const dateObj = new Date(maintenance.scheduledDate);
            const scheduledDate = !isNaN(dateObj) ? dateObj.toLocaleDateString('pt-BR') : 'Data Inválida';
            const equipmentName = maintenance.equipment && maintenance.equipment.name ? maintenance.equipment.name : 'N/A';
                    
            tr.innerHTML = `
                <td>${equipmentName}</td>
                <td>${maintenance.type}</td>
                <td>${maintenance.description}</td>
                <td>${scheduledDate}</td>`;
            tbody.appendChild(tr);
        });
    } catch (error) {
        showMessage('Erro ao carregar manutenções: ' + error.message, 'error');
        document.getElementById('maintenanceTableHeader').style.display = 'none';
    }
}

document.getElementById('maintenanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const equipmentIdValue = document.getElementById('equipmentId').value;
    const scheduledDateValue = document.getElementById('scheduledDate').value;
    const descriptionValue = document.getElementById('description').value;
    
    if (!equipmentIdValue || !scheduledDateValue || !descriptionValue) {
         showMessage('Preencha todos os campos obrigatórios (Equipamento, Data, Descrição).', 'error');
         return;
    }
    
    const data = {
        equipmentId: parseInt(document.getElementById('equipmentId').value),
        type: document.getElementById('type').value,
        description: document.getElementById('description').value,
        scheduledDate: document.getElementById('scheduledDate').value,
    };

    try {
        const url = editingId 
            ? `${API_URL}/maintenances/${editingId}`
            : `${API_URL}/maintenances`;
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
            if (response.status !== 204 && response.status !== 205) {
                try { await response.json(); } catch (e) {}
            }
            showMessage(editingId ? 'Manutenção atualizada com sucesso!' : 'Manutenção cadastrada com sucesso!', 'success');
            resetForm();
            loadMaintenances();
        } else {
            try {
                const errorData = await response.json();
                showMessage(errorData.error || `Erro (${response.status}) ao salvar`, 'error');
            } catch (e) {
                showMessage(`Erro no servidor: ${response.status}.`, 'error');
            }
        }
    } catch (error) {
        showMessage('Falha crítica de conexão com a API.', 'error');
        console.error("Falha no Fetch:", error);
    }
});

async function editMaintenance(id) {
    try {
        const response = await fetch(`${API_URL}/maintenances/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) { logout(); throw new Error('Não autorizado'); }
        if (response.status === 404) { throw new Error('Manutenção não encontrada'); }
        if (!response.ok) { throw new Error(`Erro do servidor: ${response.status}`); }

        const maintenance = await response.json();
                
        editingId = id;
        document.getElementById('maintenanceId').value = maintenance.id; 
        document.getElementById('formTitle').textContent = 'Editar Manutenção';
        document.getElementById('equipmentId').value = maintenance.equipmentId;
        document.getElementById('type').value = maintenance.type;
        document.getElementById('description').value = maintenance.description;
        
        const scheduledDate = new Date(maintenance.scheduledDate);
        if (!isNaN(scheduledDate.getTime())) { 
            document.getElementById('scheduledDate').value = scheduledDate.toISOString().split('T')[0]; 
        } else {
            document.getElementById('scheduledDate').value = '';
        }
        
        window.scrollTo(0, 0); 
        return true; 

    } catch (error) {
        showMessage('Erro ao carregar manutenção: ' + error.message, 'error'); 
        throw error;
    }
}

document.getElementById('searchMaintenanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchId = document.getElementById('searchMaintenanceId').value;
    const resultDiv = document.getElementById('searchMaintenanceResult');
    resultDiv.innerHTML = '';
    if (!searchId) return;

    try {
        const response = await fetch(`${API_URL}/maintenances/${searchId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) { logout(); return; }
        
        let data = {};
        try { data = await response.json(); } catch (e) {}

        if (response.ok) {
            const maintenance = data;
            const scheduledDate = maintenance.scheduledDate ? new Date(maintenance.scheduledDate).toLocaleDateString('pt-BR') : 'N/A';
            
            resultDiv.innerHTML = `
                <h4>Detalhes da Manutenção #${maintenance.id}</h4>
                <p><strong>Tipo:</strong> ${maintenance.type}</p>
                <p><strong>Descrição:</strong> ${maintenance.description}</p>
                <p><strong>Data Agendada:</strong> ${scheduledDate}</p>
            `;
            resultDiv.className = 'message success';
            resultDiv.style.display = 'block';
        } else if (response.status === 404) {
            resultDiv.innerHTML = `<h4>Erro na Busca</h4><p>${data.error || 'Manutenção não encontrada.'}</p>`;
            resultDiv.className = 'message error';
        } else {
            resultDiv.innerHTML = `<h4>Erro no Servidor</h4><p>${data.error || `Erro desconhecido (${response.status})`}</p>`;
            resultDiv.className = 'message error';
        }
        resultDiv.style.display = 'block';

    } catch (error) {
        showMessage('Falha crítica de conexão com a API.', 'error');
        resultDiv.className = 'message error';
        resultDiv.innerHTML = 'Falha ao conectar com a API.';
        resultDiv.style.display = 'block';
    }
});

document.getElementById('deleteMaintenanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const deleteId = document.getElementById('deleteMaintenanceId').value;
    const resultDiv = document.getElementById('deleteMaintenanceResult');
    resultDiv.innerHTML = '';
    if (!deleteId) return;

    if (!confirm(`TEM CERTEZA que deseja EXCLUIR a manutenção com ID: ${deleteId}?`)) {
        resultDiv.innerHTML = '<p>Operação cancelada.</p>';
        resultDiv.className = 'message info';
        resultDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/maintenances/${deleteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) { // Sucesso (204 No Content)
            showMessage(`Manutenção ID ${deleteId} excluída com sucesso!`, 'success');
            resultDiv.innerHTML = `<p>Manutenção ID ${deleteId} excluída com sucesso!</p>`;
            resultDiv.className = 'message success';
            loadMaintenances(); 
        } else if (response.status === 404) {
            let errorMsg = 'Manutenção não encontrada.';
            try { const errorData = await response.json(); errorMsg = errorData.error || errorMsg; } catch(e){}
            resultDiv.innerHTML = `<h4>Erro na Exclusão</h4><p>${errorMsg}</p>`;
            resultDiv.className = 'message error';
        } else {
            showMessage(`Erro (${response.status}) ao excluir`, 'error');
            resultDiv.className = 'message error';
        }
        resultDiv.style.display = 'block';

    } catch (error) {
        showMessage('Falha crítica de conexão com a API.', 'error');
        resultDiv.className = 'message error';
        resultDiv.innerHTML = 'Falha ao conectar com a API.';
        resultDiv.style.display = 'block';
    }
});

document.getElementById('loadForEditMaintenanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const editLoadId = document.getElementById('editLoadMaintenanceId').value;
    const resultDiv = document.getElementById('loadMaintenanceResult');
    resultDiv.innerHTML = '';
    if (!editLoadId) return;

    try {
        await editMaintenance(editLoadId);
        resultDiv.innerHTML = `<p class="message success" style="display:block;">Dados do ID ${editLoadId} carregados no formulário acima.</p>`;
    } catch (error) {
        resultDiv.innerHTML = `<p class="message error" style="display:block;">Erro: Manutenção ID ${editLoadId} não encontrada.</p>`;
    }
});

function resetForm() {
    editingId = null;
    document.getElementById('maintenanceId').value = ''; 
    document.getElementById('formTitle').textContent = 'Cadastrar Nova Manutenção';
    document.getElementById('maintenanceForm').reset();
    document.getElementById('maintenanceTableHeader').style.display = 'none'; 
}

loadEquipments();