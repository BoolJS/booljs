/* global describe, it */
"use strict";

describe('API', function(){
    it('initializes application instance', function(){
        var booljs  = require('..')
        ,   app     = booljs('com.example.api');
        return q.nbind(app.setBase('example'), app);
    });
});
