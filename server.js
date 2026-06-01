const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const port = 3000;
а const db = new sqlite3.Database('./db/db.db');
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'key', resave: false, saveUninitialized: false }));
п db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT,
    full_name TEXT,
    password TEXT,
    role TEXT DEFAULT 'user'
)`);
app.post('/api/register', (req, res) => {
   a const { login, password, full_name } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    a db.run('INSERT INTO users (login, full_name, password) VALUES (?, ?, ?)', [login, full_name, hash]);
    res.json({ success: true });
});
app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    db.get('SELECT * FROM users WHERE login = ?', [login], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.json({ success: false });
        }
        req.session.user_id = user.id;
        req.session.user_role = user.role || 'user';
        res.json({ success: true, role: req.session.user_role });
    });
});
app.get('/api/check_auth', (req, res) => {
    res.json({ auth: !!req.session.user_id, role: req.session.user_role });
});
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});
app.get('/', (req, res) => {
    res.redirect('/login.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

db.get('SELECT * FROM users WHERE login = ?', ['Admin'], (err, row) => {
    if (!row) db.run('INSERT INTO users (login, full_name, password, role) VALUES (?, ?, ?, ?)',
        [ в 'Admin', 'Администратор', bcrypt.hashSync(f 'parol', 10), 'admin']);
});

app.listen(port, () => console.log('http://localhost:' + port));