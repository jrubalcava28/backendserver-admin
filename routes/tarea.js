var express = require('express');
var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Tarea = require('../models/tarea');

//===========================
// Obtener todos los tareas
//===========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Tarea.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'usuario email')
        .populate('proyecto')
        .exec(
            (err, tareas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando tareas',
                        errors: err
                    });
                }

                Tarea.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        tareas: tareas,
                        total: conteo
                    });
                })


            })

});




//=============================
// Actualizar un tarea
//=============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Tarea.findById(id, (err, tarea) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar tarea',
                errors: err
            });
        }

        if (!tarea) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El tarea con el id ' + id + ' no existe',
                errors: { message: 'no existe un tarea con ese ID' }
            });
        }

        tarea.nombre = body.nombre;
        tarea.descripcion = body.descripcion;
        tarea.usuario = req.usuario._id;
        tarea.proyecto = body.proyecto;

        tarea.save((err, tareaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar tarea',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                tarea: tareaGuardado
            });

        });

    });

});




//=============================
// Creacion de un nuevo tarea
//=============================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var tarea = new Tarea({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        proyecto: body.proyecto
    });

    tarea.save((err, tareaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear tarea',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            tarea: tareaGuardado
        });

    });



});

//=============================
// Borrar un tarea por el id
//=============================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Tarea.findByIdAndDelete(id, (err, tareaBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar tarea',
                errors: err
            });
        }

        if (!tareaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un tarea con ese ID',
                errors: { message: 'No existe un tarea con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            tarea: tareaBorrado
        });


    });

});
module.exports = app;