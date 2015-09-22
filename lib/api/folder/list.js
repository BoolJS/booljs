'use strict';

/**
 * @private
 * @description Folder's list by instance
 * @return {Object} A folders' list manager
 */
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
        routes: 'routes'
    };

    Object.defineProperty(this, 'paths', { /** @ignore */ get: function () {
        return _subfolders;
    } });

    Object.defineProperty(this, 'base', {
        /** @ignore */
        get: function(){
            return _base;
        },
        /** @ignore */
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
            /** @ignore */
            get: function(){
                return (path.isAbsolute(location) ?
                    location :
                    path.join(_base, location)
                );
            },
            /** @ignore */
            set: function(folder){
                _subfolders[key] = folder;
            }
        });

    }

    for(var route in _subfolders){
        loadSubfolderProperties(route, _subfolders[route]);
    }

};
