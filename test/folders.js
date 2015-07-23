/* global describe, before, it */
'use strict';

describe('Folders', function(){
    var booljs;

    before(function () { booljs = require('..'); });

    it('create initial pre-structure', function(done){
        booljs('com.example.api').readFiles(done);
    });

    it('return a promise', function(){
        return booljs('com.example.api').readFiles();
    });
});
