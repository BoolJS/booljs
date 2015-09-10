/* global describe, before, it */
'use strict';

describe('Server', function () {
    var app;

    before(function () { app = require('..')('com.example.api'); });

    it('starts the default server', function () { return app.bootServer(); });

});
