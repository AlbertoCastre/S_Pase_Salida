const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Conexión con la base de datos
const { connection } = require('../config/config.db');

app.use(express.json());

// Servicio para obtener todos los departamentos
const getDepartamentos = (request, response) => {
    connection.query('SELECT * FROM tbl_departamento', (error, results) => {
        if (error) {
            console.error('Error al obtener departamentos:', error);
            response.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        response.status(200).json(results);
    });
};

// Servicio para agregar o editar un departamento
const postDepartamento = (request, response) => {
    const { action, id_departamento, nombre_departamento } = request.body;

    if (action === 'insert') {
        connection.query(
            'INSERT INTO tbl_departamento (nombre_departamento) VALUES (?)',
            [nombre_departamento],
            (error, results) => {
                if (error) {
                    console.error('Error al agregar departamento:', error);
                    response.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                response.status(201).json({ message: 'Departamento añadido correctamente', affectedRows: results.affectedRows });
            }
        );
    } else if (action === 'update') {
        connection.query(
            'UPDATE tbl_departamento SET nombre_departamento=? WHERE id_departamento=?',
            [nombre_departamento, id_departamento],
            (error, results) => {
                if (error) {
                    console.error('Error al actualizar departamento:', error);
                    response.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                response.status(200).json({ message: 'Departamento editado correctamente', affectedRows: results.affectedRows });
            }
        );
    } else {
        response.status(400).json({ error: 'Acción no válida' });
    }
};

// Servicio para eliminar un departamento por su ID
const deleteDepartamento = (request, response) => {
    const id_departamento = request.params.id_departamento;
    connection.query('DELETE FROM tbl_departamento WHERE id_departamento=?', [id_departamento], (error, results) => {
        if (error) {
            console.error('Error al eliminar departamento:', error);
            response.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        response.status(200).json({ message: 'Departamento eliminado correctamente', affectedRows: results.affectedRows });
    });
};

// Rutas
app.get('/departamentos', getDepartamentos);
app.post('/departamentos', postDepartamento);
app.delete('/departamentos/:id_departamento', deleteDepartamento);

module.exports = app;
