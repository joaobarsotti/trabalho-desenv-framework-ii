const pagesToCheck = [
    'equipamentos.html', 
    'manutencoes.html', 
    'usuarios.html'
];
const PROTECTED_PAGES_NAV = [
    'equipamentos.html', 
    'manutencoes.html', 
    'usuarios.html'
];
const PUBLIC_PAGES_NAV = ['inicio.html', 'cursos.html', 'contato.html', 'login.html'];

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

function checkAuthStatus() {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    const userNameSpan = document.getElementById('userName');
    const userInfoDiv = document.querySelector('.user-info');
    
    if (token && user && userNameSpan) {
        userNameSpan.textContent = `Olá, ${user.name}`;
        if (userInfoDiv) userInfoDiv.style.display = 'block';
    } else {
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});