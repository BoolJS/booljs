'use strict';

module.exports = function(instance, route, done, progress){

    var API     = require('booljs-api')
    ,   fs      = require('fs')
    ,   path    = require('path')
    ,   async   = require('async')
    ,   logger  = require('../log')
    ,   reader  = require('../../readers');

    // Check callbacks, in case they are undefined, use empty functions
    done = done || function(err){};
    progress = progress || function(progress){};

    var defer       = q.defer()
    ,   fileRegex   = /([A-Za-z-_ ]+)\.([A-Za-z]+)/;

    function read(route, files){

        async.each(files, function(file, next){
            var filename    = path.join(route, file)
            ,   info        = path.parse(filename);

            if(!fileRegex.test(file) {
                var e = new API.Error(
                    0, "EINVALIDFILENAME",
                    "The file name format is invalid"
                );
                logger.warn("configuration", file, e);
            } else {
                reader.readStatic(info.ext, filename, function(err, object){
                    if(err) {
                        logger.warn("configuration", file, err);
                        return next();
                    }
                    instance.configurations.set(info.name, object);
                    logger.log("configuration", info.name);
                    progress(info.name);
                    defer.notify(info.name);
                    next();
                });
            }

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
        read(route, files)
    });

    return defer.promise;
};
