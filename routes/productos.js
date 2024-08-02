const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Conexión con la base de datos
const { connection } = require('../config/config.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    // Imprimir los datos recibidos
    console.log("Datos recibidos en el backend:", request.body);

    const { action, id_producto, responsable_producto, id_departamento, cantidad_producto, color_producto, modelo_producto, marca_producto, serie_producto, observaciones_producto, id_motivo_salida, id_tipo_salida, fecha_estimada_reparacion_producto, observaciones_salida_producto } = request.body;

    if (action === 'insert') {
        connection.query(
            'INSERT INTO tbl_productos (responsable_producto, id_departamento, cantidad_producto, color_producto, modelo_producto, marca_producto, serie_producto, observaciones_producto, id_motivo_salida, id_tipo_salida, fecha_estimada_reparacion_producto, observaciones_salida_producto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [responsable_producto, id_departamento, cantidad_producto, color_producto, modelo_producto, marca_producto, serie_producto, observaciones_producto, id_motivo_salida, id_tipo_salida, fecha_estimada_reparacion_producto || null, observaciones_salida_producto || null],
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
            'UPDATE tbl_productos SET responsable_producto=?, id_departamento=?, cantidad_producto=?, color_producto=?, modelo_producto=?, marca_producto=?, serie_producto=?, observaciones_producto=?, id_motivo_salida=?, id_tipo_salida=?, fecha_estimada_reparacion_producto=?, observaciones_salida_producto=? WHERE id_producto=?',
            [responsable_producto, id_departamento, cantidad_producto, color_producto, modelo_producto, marca_producto, serie_producto, observaciones_producto, id_motivo_salida, id_tipo_salida, fecha_estimada_reparacion_producto || null, observaciones_salida_producto || null, id_producto],
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
