'use strict';

module.exports = function(route, reader, callback){

    var fs          = require('fs')
    ,   path        = require('path')
    ,   readRoute   = path.join(PATH, route);

    fs.readdir(readRoute, function(err, files){
        if(err) callback(err);
        else readFiles(files);
    });

    function readFiles(files){

        _.each(files, function(file){
            var filename    = path.join(readRoute, file)
            ,   fileRegex   = /([A-Za-z-_ ]+)\.([A-Za-z]+)/;

            if(fileRegex.test(file)){
                var name        = file.split('.')[0]
                ,   extension   = file.split('.')[1];
            } else {
                var name        = null
                ,   extension   = null;
            }

            var stat = fs.statSync(filename);

            if(name && stat.isFile() && reader.validExtension === extension){
                reader.read(filename, function(err, object){
                    if(err) callback(err);
                    else callback(null, name, object);
                });
            }

        });

    }

}
