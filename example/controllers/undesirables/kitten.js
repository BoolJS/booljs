'use strict';

module.exports = function (app) {
    const { Dog } = app.dao;
    const { promise } = new app.views.Json();

    this.list = function (request, response, next) {
        var dog = new Dog();
        promise(dog.list(), response, next);
    };
};
