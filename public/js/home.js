const logout_btn = document.getElementById('logout_btn');
fetch('/api/check_auth')
    .then(res => res.json())
    .then(data => {
        if (!data.auth) window.location.href = '/login.html';
    });
    
if (logout_btn) {
    logout_btn.onclick = async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/login.html';
    };
}