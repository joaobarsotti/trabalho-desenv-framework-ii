// backend/nav_manager.js
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token'); 
    const protectedLinksContainer = document.getElementById('protectedLinks');
    const loginLink = document.getElementById('loginLink');
    const userInfoDiv = document.getElementById('userInfo'); 
    const userNameSpan = document.getElementById('userName');
    
    let user = null;
    try {
        user = JSON.parse(sessionStorage.getItem('user'));
    } catch (e) {
        console.error("Erro ao parsear dados do usuário:", e);
    }
    
    if (token) {
        if (protectedLinksContainer) {
            protectedLinksContainer.style.display = 'inline';
        }
        if (loginLink) {
            loginLink.style.display = 'none';
        }
        if (userInfoDiv) {
            userInfoDiv.style.display = 'block';
        }
        if (userNameSpan && user) {
            userNameSpan.textContent = `Olá, ${user.name}`;
        }
    } else {
        if (protectedLinksContainer) {
            protectedLinksContainer.style.display = 'none';
        }
        if (loginLink) {
            loginLink.style.display = 'inline';
        }
        if (userInfoDiv) {
            userInfoDiv.style.display = 'none';
        }
    }
});

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}