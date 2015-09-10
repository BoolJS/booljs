'use strict';

module.exports = function(app){

    var Dog     = app.dao.Dog
    ,   json    = new app.views.Json();

    return {
        list: function(req, res, next){
            var dog = new Dog();
            json.promise(dog.list(), res, next);
        }
    };

};
