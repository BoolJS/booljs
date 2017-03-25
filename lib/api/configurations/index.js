'use strict';

/**
 * Read configuration files
 * @param {Object} instance - Application's instance
 * @param {String} route - Configuration's directory
 * @param {module:booljs~doneCallback} done - Executed once reading process is
 * completed
 * @param {module:booljs~progressCallback} progress - Executed after each file
 * has been read
 * @return {Promise}
 */
module.exports = function(instance, route, done, progress){

    var API     = require('booljs.api')
    ,   fs      = require('fs')
    ,   path    = require('path')
    ,   async   = require('async')
    ,   logger  = require('../log')
    ,   Reader  = require('../../readers');

    // Check callbacks, in case they are undefined, use empty functions
    done = done || function(err){};
    progress = progress || function(progress){};

    var defer       = q.defer()
    ,   fileRegex   = /([A-Za-z-_ ]+)\.([A-Za-z]+)/;

    function read(route, files){

        async.each(files, function(file, next){
            var filename    = path.join(route, file)
            ,   info        = path.parse(filename);

            if(!fileRegex.test(file)){
                var e = new API.Error(
                    0, 'EINVALIDFILENAME',
                    'The file name format is invalid'
                );
                logger.warn('configuration', file, e);
            } else {
                var reader = new Reader();
                reader.readStatic(info.ext, filename, function(err, obj){
                    if(err) {
                        logger.warn('configuration', file, err);
                        return next();
                    }
                    instance.getComponents().configuration.set(info.name, obj);
                    logger.log('configuration', info.name);
                    progress(info.name);
                    defer.notify(info.name);
                    return next();
                });
            }

        }, function(err){
            instance.getComponents().configuration.freeze();
            if(err) defer.reject(err);
            else defer.resolve();
            return done(err);
        });

    }

    fs.readdir(route, function(err, files){
        if(err) {
            logger.error('folder', route, err);
            defer.reject(err);
            return done(err);
        }
        read(route, files);
    });

    return defer.promise;
};
