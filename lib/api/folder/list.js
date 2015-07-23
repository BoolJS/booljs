'use strict';

module.exports = function(){

    var self            = this
    ,   path            = require('path');

    var _base           = PATH
    ,   _subfolders     = {
        configuration: 'configuration',
        controllers: 'controllers',
        dao: 'dao',
        models: 'models',
        plugins: 'plugins',
        routes: 'routes',
        views: 'views'
    };

    Object.defineProperty(this, 'paths', { get: function () {
        return _subfolders;
    } });

    Object.defineProperty(this, 'base', {
        get: function(){
            return _base;
        },
        set: function(folder){
            if(path.isAbsolute(folder)){
                _base = folder;
            } else {
                _base = path.join(PATH, folder);
            }
        }
    });

    function loadSubfolderProperties(key, location){

        Object.defineProperty(self, key, {
            get: function(){
                return (path.isAbsolute(location) ?
                    location :
                    path.join(_base, location)
                );
            },
            set: function(folder){
                _subfolders[key] = folder;
            }
        });

    }

    for(var route in _subfolders){
        loadSubfolderProperties(route, _subfolders[route]);
    }

};
