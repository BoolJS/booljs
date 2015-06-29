'use strict';

module.exports = function(app){

    var Dog     = app.dao.Dog
    ,   json    = app.views.json;

    return {
        list: function(req, res, next){
            var dog = new Dog();

            dog.list().then(function(dogs){
                json(dogs, res);
            }).catch(next);
        }
    };

};
