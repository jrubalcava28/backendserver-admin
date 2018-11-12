var express = require('express');
var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Proyecto = require('../models/proyecto');

//===========================
// Obtener todos los proyectos
//===========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Proyecto.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, proyectos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando proyectos',
                        errors: err
                    });
                }

                Proyecto.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        proyectos: proyectos,
                        total: conteo
                    });

                })


            })

});




//=============================
// Actualizar un proyecto
//=============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Proyecto.findById(id, (err, proyecto) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar proyecto',
                errors: err
            });
        }

        if (!proyecto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El proyecto con el id ' + id + ' no existe',
                errors: { message: 'no existe un proyecto con ese ID' }
            });
        }

        proyecto.nombre = body.nombre;
        proyecto.tipo = body.tipo;
        proyecto.usuario = req.usuario._id;

        proyecto.save((err, proyectoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar proyecto',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                proyecto: proyectoGuardado
            });

        });

    });

});




//=============================
// Creacion de un nuevo proyecto
//=============================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var proyecto = new Proyecto({
        nombre: body.nombre,
        tipo: body.tipo,
        usuario: req.usuario._id
    });

    proyecto.save((err, proyectoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear proyecto',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            proyecto: proyectoGuardado
        });

    });



});

//=============================
// Borrar un proyecto por el id
//=============================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Proyecto.findByIdAndDelete(id, (err, proyectoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar proyecto',
                errors: err
            });
        }

        if (!proyectoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un proyecto con ese ID',
                errors: { message: 'No existe un proyecto con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            proyecto: proyectoBorrado
        });


    });

});
module.exports = app;