const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Asegúrate que este archivo exista

// Crear nuevo cliente
router.post('/', (req, res) => {
  const { cedula, nombre, apellido, telefono, estado_civil } = req.body;
  const sql = `
    INSERT INTO clientes (cedula, nombre, apellido, telefono, estado_civil)
    VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [cedula, nombre, apellido, telefono, estado_civil], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error al guardar el cliente');
    }
    res.redirect('/clientes/vista');
  });
});

// Listar clientes como JSON
router.get('/', (_req, res) => {
  db.all('SELECT * FROM clientes', (err, rows) => {
    if (err) return res.status(500).send('Error al obtener clientes');
    res.json(rows);
  });
});

// Mostrar vista principal con EJS
router.get('/vista', (_req, res) => {
  db.all('SELECT * FROM clientes', (err, rows) => {
    if (err) return res.status(500).send('Error al obtener clientes');
    res.render('index', { clientes: rows });
  });
});

// Mostrar formulario para editar
router.get('/:cedula/edit', (req, res) => {
  const { cedula } = req.params;
  db.get('SELECT * FROM clientes WHERE cedula = ?', [cedula], (err, cliente) => {
    if (err || !cliente) return res.status(404).send('Cliente no encontrado');
    res.render('edit', { cliente });
  });
});

// Actualizar cliente
router.put('/:cedula', (req, res) => {
  const { cedula } = req.params;
  const { nombre, apellido, telefono, estado_civil } = req.body;
  const sql = `
    UPDATE clientes SET nombre = ?, apellido = ?, telefono = ?, estado_civil = ?
    WHERE cedula = ?`;

  db.run(sql, [nombre, apellido, telefono, estado_civil, cedula], (err) => {
    if (err) return res.status(500).send('Error al actualizar cliente');
    res.redirect('/clientes/vista');
  });
});

// Eliminar cliente
router.delete('/:cedula', (req, res) => {
  const { cedula } = req.params;
  db.run('DELETE FROM clientes WHERE cedula = ?', [cedula], (err) => {
    if (err) return res.status(500).send('Error al eliminar cliente');
    res.redirect('/clientes/vista');
  });
});

module.exports = router;
