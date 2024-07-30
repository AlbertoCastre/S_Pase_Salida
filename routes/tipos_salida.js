const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Conexión con la base de datos
const { connection } = require('../config/config.db');

app.use(express.json());

// Servicio para obtener todos los tipos de salida
const getTiposSalida = (request, response) => {
    connection.query('SELECT * FROM tbl_tipos_salida', (error, results) => {
        if (error) {
            console.error('Error al obtener tipos de salida:', error);
            response.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        response.status(200).json(results);
    });
};

// Servicio para agregar o editar un tipo de salida
const postTipoSalida = (request, response) => {
    const { action, id_tipo_salida, tipo_salida_nombre } = request.body;

    if (action === 'insert') {
        connection.query(
            'INSERT INTO tbl_tipos_salida (tipo_salida_nombre) VALUES (?)',
            [tipo_salida_nombre],
            (error, results) => {
                if (error) {
                    console.error('Error al agregar tipo de salida:', error);
                    response.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                response.status(201).json({ message: 'Tipo de salida añadido correctamente', affectedRows: results.affectedRows });
            }
        );
    } else if (action === 'update') {
        connection.query(
            'UPDATE tbl_tipos_salida SET tipo_salida_nombre=? WHERE id_tipo_salida=?',
            [tipo_salida_nombre, id_tipo_salida],
            (error, results) => {
                if (error) {
                    console.error('Error al actualizar tipo de salida:', error);
                    response.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                response.status(200).json({ message: 'Tipo de salida editado correctamente', affectedRows: results.affectedRows });
            }
        );
    } else {
        response.status(400).json({ error: 'Acción no válida' });
    }
};

// Servicio para eliminar un tipo de salida por su ID
const deleteTipoSalida = (request, response) => {
    const id_tipo_salida = request.params.id_tipo_salida;
    connection.query('DELETE FROM tbl_tipos_salida WHERE id_tipo_salida=?', [id_tipo_salida], (error, results) => {
        if (error) {
            console.error('Error al eliminar tipo de salida:', error);
            response.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        response.status(200).json({ message: 'Tipo de salida eliminado correctamente', affectedRows: results.affectedRows });
    });
};

// Rutas
app.get('/tipos_salida', getTiposSalida);
app.post('/tipos_salida', postTipoSalida);
app.delete('/tipos_salida/:id_tipo_salida', deleteTipoSalida);

module.exports = app;
