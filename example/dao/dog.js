'use strict';

module.exports = function(app){

    var dog = new app.models.Dog();

    return {
        list: function(){
            return dog.list();
        }
    };

};
