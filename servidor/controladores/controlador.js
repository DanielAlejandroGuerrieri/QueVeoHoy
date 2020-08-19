var con = require('../lib/conexionbd');

function buscarPeliculas(req, res) {
    //let sql= "select * from pelicula" -- mostraba la lista completa de peliculas sin acomodarlas
    let anio = req.query.anio;
    let titulo = req.query.titulo;
    let genero = req.query.genero;
    let orden = req.query.columna_orden;
    let tipo_orden = req.query.tipo_orden;
    let pagina = req.query.pagina;
    let cantidad = req.query.cantidad;


    if (!cantidad) {
        cantidad = 52; // cantidad de peliculas a mostrar por pagina si es null
    }


    let sql = createQuery(titulo, anio, genero, orden, tipo_orden, pagina, cantidad);
    let sqlCount = createQueryCount(titulo, anio, genero);

    con.query(sql, function(error, resultado, fields) {
        con.query(sqlCount, function(error, resultado1, fields) {
            if (error) {
                console.log('Hubo un error en la consulta', error.message);
                return res.status(404).send('Hubo un error en la consulta');
            }
            let response = {
                'peliculas': resultado,
                'total': resultado1[0].total
            };
            res.send(JSON.stringify(response));
        });
    });

    function createQuery(titulo, anio, genero, orden, tipo_orden, pagina, cantidad) {
        let query = "SELECT * FROM pelicula ORDER BY " + orden + " " + tipo_orden + " LIMIT " + (pagina - 1) * cantidad + "," + cantidad + "";
        if (titulo != undefined || anio != undefined || genero != undefined) {
            query = "SELECT p.titulo, p.duracion, p.trama, p.director, p.anio, p.fecha_lanzamiento, p.puntuacion, p.poster, g.nombre FROM pelicula p JOIN genero AS g ON p.genero_id = g.id WHERE titulo LIKE '" +
                titulo + "%' OR p.anio = '" + anio + "' OR g.id = '" + genero + "' ORDER BY " + orden + " " + tipo_orden + " LIMIT " + (pagina - 1) * cantidad + "," + cantidad + "";
        }
        return query;
    }

    function createQueryCount(titulo, anio, genero) {
        let query = "SELECT COUNT(*) as total FROM pelicula";
        if (titulo != undefined || anio != undefined || genero != undefined) {
            query = "select COUNT(*) as total FROM pelicula p JOIN genero AS g ON p.genero_id = g.id WHERE titulo LIKE '" +
                titulo + "%' OR p.anio = '" + anio + "' OR g.id = '" + genero + "'";
        }
        return query;
    }

}



function buscarGenero(req, res) {
    let sql = "select * from genero";

    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        let response = {
            'generos': resultado
        };
        res.send(JSON.stringify(response));
    });
}

function obtenerPelicula(req, res) {
    let id = req.params.id;
    let sql = "SELECT p.titulo, p.duracion, p.trama, p.director, p.anio, p.fecha_lanzamiento, p.puntuacion, p.poster, a.nombre as actores, g.nombre FROM pelicula p JOIN genero g ON p.genero_id = g.id JOIN actor_pelicula ac ON p.id = ac.pelicula_id JOIN actor a ON ac.actor_id = a.id WHERE p.id = '" + id + "'";

    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log('Hubo un error en la consulta', error.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        let response = {
            'pelicula': resultado[0],
            'actores': resultado,
            'genero': resultado[0]
        };
        res.send(JSON.stringify(response));
    });
}

function buscarRecomendacion(req, res) {
    //base para armar la sentencia a la base de datos
    var sql = "select pelicula.id,titulo,duracion,director,anio,fecha_lanzamiento,puntuacion,poster,trama,nombre from pelicula join genero on pelicula.genero_id = genero.id where pelicula.id = pelicula.id";

    //se chequean los parametros que se enviaron desde el front-end para el armado de la sentencia a la base de datos
    if (req.query.genero) {
        genero = req.query.genero;
        sql = sql + " and genero.nombre =" + "'" + genero + "'";
    }

    if (req.query.anio_inicio) {
        var anioInicio = req.query.anio_inicio;
        sql = sql + " and pelicula.anio between " + anioInicio;
    }

    if (req.query.anio_fin) {
        var anioFin = req.query.anio_fin;
        sql = sql + " and " + anioFin;
    }

    if (req.query.puntuacion) {
        var puntuacion = req.query.puntuacion;
        sql = sql + " and puntuacion >=" + puntuacion;
    }

    //luego del armado de la sentencia de consulta a la base, se da la respuesta al front-end con response
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log('Hubo un error en la consulta', error.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        let response = {
            'peliculas': resultado
        };
        res.send(JSON.stringify(response));
    });
}



module.exports = {
    buscarPeliculas: buscarPeliculas,
    buscarGenero: buscarGenero,
    obtenerPelicula: obtenerPelicula,
    buscarRecomendacion: buscarRecomendacion
};