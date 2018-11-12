var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:file', (req, res, next) => {


    var tipo = req.params.tipo;
    var file = req.params.file;

    var pathFile = path.resolve(__dirname, `../uploads/${ tipo }/${ file }`);

    if (fs.existsSync(pathFile)) {
        res.sendFile(pathFile);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;