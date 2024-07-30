const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Conexión con la base de datos
const { connection } = require('../config/config.db');

app.use(express.json());

// Servicio para obtener todos los productos
const getProductos = (request, response) => {
    connection.query('SELECT * FROM tbl_productos', (error, results) => {
        if (error) {
            console.error('Error al obtener productos:', error);
            response.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        response.status(200).json(results);
    });
};

// Servicio para agregar o editar un producto
const postProducto = (request, response) => {
    const { action, id_producto, responsable, id_departamento, hora_entrada, cantidad, color, modelo, marca, serie, observaciones, id_motivo_salida, id_tipo_salida, fecha_estimacion_reparacion } = request.body;

    if (action === 'insert') {
        connection.query(
            'INSERT INTO tbl_productos (responsable, id_departamento, hora_entrada, cantidad, color, modelo, marca, serie, observaciones, id_motivo_salida, id_tipo_salida, fecha_estimacion_reparacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [responsable, id_departamento, hora_entrada, cantidad, color, modelo, marca, serie, observaciones, id_motivo_salida, id_tipo_salida, fecha_estimacion_reparacion],
            (error, results) => {
                if (error) {
                    console.error('Error al agregar producto:', error);
                    response.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                response.status(201).json({ message: 'Producto añadido correctamente', affectedRows: results.affectedRows });
            }
        );
    } else if (action === 'update') {
        connection.query(
            'UPDATE tbl_productos SET responsable=?, id_departamento=?, hora_entrada=?, cantidad=?, color=?, modelo=?, marca=?, serie=?, observaciones=?, id_motivo_salida=?, id_tipo_salida=?, fecha_estimacion_reparacion=? WHERE id_producto=?',
            [responsable, id_departamento, hora_entrada, cantidad, color, modelo, marca, serie, observaciones, id_motivo_salida, id_tipo_salida, fecha_estimacion_reparacion, id_producto],
            (error, results) => {
                if (error) {
                    console.error('Error al actualizar producto:', error);
                    response.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                response.status(200).json({ message: 'Producto editado correctamente', affectedRows: results.affectedRows });
            }
        );
    } else {
        response.status(400).json({ error: 'Acción no válida' });
    }
};

// Servicio para eliminar un producto por su ID
const deleteProducto = (request, response) => {
    const id_producto = request.params.id_producto;
    connection.query('DELETE FROM tbl_productos WHERE id_producto=?', [id_producto], (error, results) => {
        if (error) {
            console.error('Error al eliminar producto:', error);
            response.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        response.status(200).json({ message: 'Producto eliminado correctamente', affectedRows: results.affectedRows });
    });
};

// Rutas
app.get('/productos', getProductos);
app.post('/productos', postProducto);
app.delete('/productos/:id_producto', deleteProducto);

module.exports = app;
