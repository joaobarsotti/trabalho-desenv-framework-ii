const API_URL = 'http://localhost:8000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
            
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
            
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
    
            successMessage.textContent = 'Login realizado com sucesso! Redirecionando...';
            successMessage.style.display = 'block';

            sessionStorage.setItem('isLoggedIn', 'true');

            setTimeout(() => {
            window.location.href = 'inicio.html';
            }, 1500);
        } else {
            errorMessage.textContent = data.error || 'Erro ao fazer login';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Erro ao conectar com o servidor';
        errorMessage.style.display = 'block';
    }
});