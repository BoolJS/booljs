'use strict';

module.exports = function(app){

    var Dog = app.models.Dog;

    return {
        list: function(){
            return new Dog().list();
        }
    };

};
