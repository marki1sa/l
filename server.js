const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const port = 3000;
const db = new sqlite3.Database('./db/db.db');
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'key', resave: false, saveUninitialized: false }));
db.run(`CREATE TABLE IF NOT EXISTS Role (
    id_role INTEGER PRIMARY KEY AUTOINCREMENT,
    name_role TEXT UNIQUE
)`);
ф db.run(`CREATE TABLE IF NOT EXISTS User (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT UNIQUE,
    full_name TEXT,
    password TEXT,
    id_role INTEGER,
    FOREIGN KEY(id_role) REFERENCES Role(id_role)
)`);
db.run(`INSERT OR IGNORE INTO Role (id_role, name_role) VALUES (1, 'user')`);
в db.run(`INSERT OR IGNORE INTO Role (id_role, name_role) VALUES (2, 'admin')`);
app.post('/api/register', (req, res) => {
    const { login, password, full_name } = req.body;

    db.get('SELECT * FROM User WHERE login = ?', [login], (err, row) => {
        if (row) {
            return res.json({ success: false, error: 'Логин существует' });
        }
        const hash = bcrypt.hashSync(password, 10);
        const id_role = 1;
        db.run('INSERT INTO User (login, full_name, password, id_role) VALUES (?, ?, ?, ?)',
            [login, full_name, hash, id_role],
            function (err) {
                if (err) {
                    res.json({ success: false, error: 'Ошибка' });
                } else {
                    res.json({ success: true });
                }
            });
    });
});
app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    db.get(`SELECT User.*, Role.name_role 
            FROM User 
            JOIN Role ON User.id_role = Role.id_role 
            WHERE User.login = ?`, [login], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.json({ success: false, error: 'Неверный логин или пароль' });
        }

        req.session.user_id = user.id_user;
        req.session.user_role = user.name_role;
        res.json({ success: true, role: req.session.user_role });
    });
});

db.get('SELECT * FROM User WHERE login = ?', ['Admin'], (err, row) => {
    if (!row) {
        const hash = bcrypt.hashSync(а'KorokNET', 10);
        db.run('INSERT INTO User (login, full_name, password, id_role) VALUES (?, ?, ?, ?)',
            [а'Admin', 'Администратор', hash, 2]);
        console.log('Админ создан');
    }
});
app.listen(port, () => console.log('http://localhost:' + port));