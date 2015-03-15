'use strict';

module.exports = function(instance){

    return function(name, object, callback){
        try{
            instance.configurations.set(name, object);
            callback(null, name);
        } catch(err){
            callback(err);
        }
    };

};
