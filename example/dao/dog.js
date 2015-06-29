'use strict';

module.exports = function(app){

    var Dog = app.db.Dog;

    return {
        list: function(){
            return Dog.list();
        }
    };

};
