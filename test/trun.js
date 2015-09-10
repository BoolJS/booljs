/* global describe, before, it */
'use strict';

describe('Run', function () {
    var app;

    before(function () { app = require('..')('com.example.run'); });

    it('all together now', function () {
        process.env.PORT = 3002;
        return app
            .setBase('example')
            .run();
    });
});
