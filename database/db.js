const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'clientes.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      cedula TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      telefono TEXT NOT NULL,
      estado_civil TEXT NOT NULL
    )
  `);
});

module.exports = db;
