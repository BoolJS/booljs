/* global describe, before, it */
"use strict";

describe('Folders', function(){
    var booljs;

    before(function () { booljs = require('..'); });

    it('Reads folders and creates initial pre-structure', function(done){
        booljs('com.example.api').readFiles(done);
    });

    it('Read folders returns a promise', function(){
        return booljs('com.example.api').readFiles();
    });
});
