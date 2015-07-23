'use strict';

module.exports = function (app) {

    var dog = new app.controllers.Dog();

    return [
        {
            method: 'get',
            action: dog.list,
            cors: true
        }
    ];

};
