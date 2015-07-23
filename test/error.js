/* global describe, it */
'use strict';

describe('BoolError', function () {

    it('is added to app components', function (done) {
        var booljs  = require('..')
        ,   app     = booljs('com.example.api');

        app.insertBoolError(done);
    });

});
