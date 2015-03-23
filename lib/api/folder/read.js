'use strict';

module.exports = function(instance, component, route, type, done, progress){
    var fs          = require('fs')
    ,   path        = require('path')
    ,   async       = require('async')
    ,   logger      = require('../log');

    done = done || function(err){};
    progress = progress || function(){};

    var defer       = q.defer()
    ,   fileRegex   = /([A-Za-z-_ ]+)\.([A-Za-z]+)/;

    function read(route, component, files){

        async.each(files, function(file, next){
            var filename    = path.join(route, file)
            ,   info        = path.parse(filename);

            fs.stat(filename, function(err, stats){
                if(err) {
                    logger.error(type, file, err);
                    return next(err);
                }

                if(stats.isFile()){
                    instance.insertComponent(info.name, filename, component);
                    logger.log(type, info.name);
                    progress(info.name);
                    defer.notify(info.name);
                    next();
                } else {
                    next();
                }

            });
        }, function(err){
            if(err) defer.reject(err);
            else defer.resolve();
            done(err);
        });
    }

    fs.readdir(route, function(err, files){
        if(err) {
            logger.error("folder", route, err);
            defer.reject(err);
            return done(err);
        }
        read(route, component, files);
    });

    return defer.promise;
};
