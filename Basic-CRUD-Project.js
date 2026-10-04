// Basic CRUD Project: single file (backend + frontend)
// Run: npm install express better-sqlite3  ->  node Basic-CRUD-Project.js  ->  http://localhost:3000

const express = require('express');
const db = new (require('better-sqlite3'))('tasks.db');
db.exec('CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, title TEXT NOT NULL, done INT DEFAULT 0)');

const page = `<!DOCTYPE html>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tasks CRUD</title>
<style>body{font:17px system-ui,sans-serif;max-width:520px;margin:auto;padding:16px}li{display:flex;gap:8px;align-items:center;padding:6px 0}li span{flex:1}.d{text-decoration:line-through;color:#888}input{padding:8px}</style>
<h2>Tasks</h2>
<form onsubmit="add(event)"><input id="t" placeholder="New task" required> <button>Add</button></form>
<ul id="l" style="list-style:none;padding:0"></ul>
<script>
const api = (u, m = 'GET', b) => fetch('/api/tasks' + u, { method: m, headers: { 'Content-Type': 'application/json' }, body: b && JSON.stringify(b) }).then(r => r.json());
async function load() {
  const rows = await api('');
  l.innerHTML = rows.map(t => \`<li><input type=checkbox \${t.done ? 'checked' : ''} onchange="save(\${t.id},'\${t.title.replace(/'/g, "\\\\'")}',this.checked)">
    <span class="\${t.done ? 'd' : ''}">\${t.title.replace(/</g, '&lt;')}</span>
    <button onclick="edit(\${t.id},\${t.done})">Edit</button><button onclick="del(\${t.id})">Delete</button></li>\`).join('');
}
async function add(e) { e.preventDefault(); await api('', 'POST', { title: t.value }); t.value = ''; load(); }
async function save(id, title, done) { await api('/' + id, 'PUT', { title, done: done ? 1 : 0 }); load(); }
async function edit(id, done) { const n = prompt('New title'); if (n) { await api('/' + id, 'PUT', { title: n, done }); load(); } }
async function del(id) { await api('/' + id, 'DELETE'); load(); }
load();
</script>
`;

const app = express().use(express.json());

app.get('/api/tasks', (_, r) => r.json(db.prepare('SELECT * FROM tasks ORDER BY id DESC').all()));                         // Read
app.post('/api/tasks', (q, r) => r.json(db.prepare('INSERT INTO tasks(title) VALUES(?)').run(q.body.title)));              // Create
app.put('/api/tasks/:id', (q, r) => r.json(db.prepare('UPDATE tasks SET title=?, done=? WHERE id=?').run(q.body.title, q.body.done, q.params.id))); // Update
app.delete('/api/tasks/:id', (q, r) => r.json(db.prepare('DELETE FROM tasks WHERE id=?').run(q.params.id)));               // Delete

app.get('/', (_, r) => r.send(page));

app.listen(process.env.PORT || 3000, () => console.log('Running'));
