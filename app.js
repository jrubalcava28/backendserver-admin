// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var projectoRoutes = require('./routes/proyecto');
var tareaRoutes = require('./routes/tarea');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var filesRoutes = require('./routes/files');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/projectosDB', (err, res) => {

    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', ' online');
})


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/proyecto', projectoRoutes);
app.use('/tarea', tareaRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/files', filesRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' online');
});