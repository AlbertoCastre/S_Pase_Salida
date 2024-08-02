require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Reemplaza con la URL de tu cliente React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permitir cookies y encabezados autorizados
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargamos el archivo de rutas
app.use(require('./routes/departamentos'));
app.use(require('./routes/tipos_salida'));
app.use(require('./routes/motivos_salida'));
app.use(require('./routes/productos'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('El servidor escucha en el puerto ' + PORT);
});

module.exports = app;
