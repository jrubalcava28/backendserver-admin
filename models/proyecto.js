var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var proyectoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    tipo: { type: String, required: [true, 'El tipo de proyecto  es necesario'] },
    file: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'proyectos' });


module.exports = mongoose.model('proyectos', proyectoSchema);