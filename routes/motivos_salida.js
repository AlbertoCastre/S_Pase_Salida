const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Conexión con la base de datos
const { connection } = require('../config/config.db');

app.use(express.json());

// Servicio para obtener todos los motivos de salida
const getMotivosSalida = (request, response) => {
    connection.query('SELECT * FROM tbl_motivos_salida', (error, results) => {
        if (error) {
            console.error('Error al obtener motivos de salida:', error);
            response.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        response.status(200).json(results);
    });
};

// Servicio para agregar o editar un motivo de salida
const postMotivoSalida = (request, response) => {
    const { action, id_motivo_salida, motivo_salida_nombre } = request.body;

    if (action === 'insert') {
        connection.query(
            'INSERT INTO tbl_motivos_salida (motivo_salida_nombre) VALUES (?)',
            [motivo_salida_nombre],
            (error, results) => {
                if (error) {
                    console.error('Error al agregar motivo de salida:', error);
                    response.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                response.status(201).json({ message: 'Motivo de salida añadido correctamente', affectedRows: results.affectedRows });
            }
        );
    } else if (action === 'update') {
        connection.query(
            'UPDATE tbl_motivos_salida SET motivo_salida_nombre=? WHERE id_motivo_salida=?',
            [motivo_salida_nombre, id_motivo_salida],
            (error, results) => {
                if (error) {
                    console.error('Error al actualizar motivo de salida:', error);
                    response.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                response.status(200).json({ message: 'Motivo de salida editado correctamente', affectedRows: results.affectedRows });
            }
        );
    } else {
        response.status(400).json({ error: 'Acción no válida' });
    }
};

// Servicio para eliminar un motivo de salida por su ID
const deleteMotivoSalida = (request, response) => {
    const id_motivo_salida = request.params.id_motivo_salida;
    connection.query('DELETE FROM tbl_motivos_salida WHERE id_motivo_salida=?', [id_motivo_salida], (error, results) => {
        if (error) {
            console.error('Error al eliminar motivo de salida:', error);
            response.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        response.status(200).json({ message: 'Motivo de salida eliminado correctamente', affectedRows: results.affectedRows });
    });
};

// Rutas
app.get('/motivos_salida', getMotivosSalida);
app.post('/motivos_salida', postMotivoSalida);
app.delete('/motivos_salida/:id_motivo_salida', deleteMotivoSalida);

module.exports = app;
