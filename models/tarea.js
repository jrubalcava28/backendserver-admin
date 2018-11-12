var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tareaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    proyecto: {
        type: Schema.Types.ObjectId,
        ref: 'proyectos',
        required: [true, 'El id Proyecto es un campo obligatorio']
    }
});

module.exports = mongoose.model('Tarea', tareaSchema);