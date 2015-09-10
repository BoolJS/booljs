'use strict';

module.exports = function(instance, component, route, type, done, progress){
    var fs          = require('fs')
    ,   path        = require('path')
    ,   async       = require('async')
    ,   logger      = require('../log');

    done = done || function(err){};
    progress = progress || function(){};

    var defer = q.defer();

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
                    var cannonicalName = info.name.toLowerCase()
                    ,   separatedNames = cannonicalName.split(/_/);

                    info.name = _.map(separatedNames, function (name) {
                        return name.charAt(0).toUpperCase() + name.slice(1);
                    }).join('');
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
            logger.error('folder', route, err);
            defer.reject(err);
            return done(err);
        }
        read(route, component, files);
    });

    return defer.promise;
};
