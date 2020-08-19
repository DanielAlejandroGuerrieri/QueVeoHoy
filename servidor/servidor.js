//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador = require('./controladores/controlador');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/peliculas', controlador.buscarPeliculas);
app.get('/peliculas/recomendacion', controlador.buscarRecomendacion);
app.get('/generos', controlador.buscarGenero);
app.get('/peliculas/:id', controlador.obtenerPelicula);



//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function() {
    console.log("Escuchando en el puerto " + puerto);
});