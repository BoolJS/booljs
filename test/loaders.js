/* global describe, before, it */
'use strict';

describe('Loaders', function () {
    var api;

    before(function () { api = require('..')('com.example.api'); });

    it('fetch models', function () { return api.loadDatabase(); });

    it('fetch components', function () { return api.loadComponents(); });

});
