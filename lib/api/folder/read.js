'use strict';

module.exports = function(instance, component, route, type, done, progress){

    var fs          = require('fs')
    ,   path        = require('path')
    ,   async       = require('async')
    ,   logger      = require('../log')
    ,   fileRegex   = /([A-Za-z-_ ]+)\.([A-Za-z]+)/;

    function read(route, component, files){

        async.each(files, function(file, next){
            var filename    = path.join(route, file)
            ,   info        = path.parse(filename);

            fs.stat(filename, function(err, stats){
                if(err) return next(err);

                if(stats.isFile()){
                    instance.insertComponent(info.name, filename, component);
                    logger(type, info.name);
                    if(progress) progress(info.name);
                    next();
                } else {
                    next();
                }

            });
        }, done);
    }

    fs.readdir(route, function(err, files){
        if(err) return done(err);
        read(route, component, files);
    });

};
