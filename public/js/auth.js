const login_form = document.getElementById('login_form');
const register_form = document.getElementById('register_form');
const error_div = document.getElementById('error_message');
if (login_form) {
    fetch('/api/check_auth').then(r => r.json()).then(data => {
        if (data.auth) {
            if (data.role === 'admin') window.location.href = '/admin';
            else window.location.href = '/home';
        }
    });
    login_form.onsubmit = async (e) => {
        e.preventDefault();
        let login = document.getElementById('login').value;
        let password = document.getElementById('password').value;
        let res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: login, password: password })
        });
        let data = await res.json();
        if (data.success) {
            if (data.role === 'admin') window.location.href = '/admin';
            else window.location.href = '/home';
        } else {
            error_div.textContent = data.error;
        }
    };
}
if (register_form) {
    register_form.onsubmit = async (e) => {
        e.preventDefault();
        let login = document.getElementById('login').value;
        let password = document.getElementById('password').value;
        let full_name = document.getElementById('full_name').value;
        let phone = document.getElementById('phone').value;
        let email = document.getElementById('email').value;
        if (login.length < 6) {
            error_div.textContent = 'Логин слишком короткий';
            return;
        }
        if (password.length < 8) {
            error_div.textContent = 'Пароль слишком короткий';
            return;
        }
        let res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                login: login,
                password: password,
                full_name: full_name,
                phone: phone,
                email: email
            })
        });
        let data = await res.json();
        if (data.success) {
            alert('OK');
            window.location.href = '/login.html';
        } else {
            error_div.textContent = data.error;
        }
    };
}