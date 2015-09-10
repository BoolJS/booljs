'use strict';

var dogs = [];

module.exports = function (app) {

    return {
        list: function () {
            return q.resolve(dogs);
        },
        index: function (id) {
            for(var dog in dogs){
                if(dogs[dog].id === id) return q.resolve(dog);
            }
            return null;
        },
        find: function (id) {
            var index = this.index(id);
            if(index === null) throw new app.Error(
                404, 'dog_not_found', 'The searched dog wasn\'t in the list'
            );
            return q.resolve(dogs[index]);
        },
        update: function (id, dog) {
            injector(this.find(id), dog);
        },
        delete: function (id) {
            var index = this.index(id);
            if(index === null) throw new app.Error(
                404, 'dog_not_found', 'The searched dog wasn\'t in the list'
            );
            dogs.splice(index, 1);
        }
    };
};
