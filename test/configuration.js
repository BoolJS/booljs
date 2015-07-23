/* global describe, before, it */
'use strict';

describe('Configuration', function(){
    var booljs;

    before(function(){
        booljs = require('..');
    });

    it('read and load configuration files into instance', function(done){
        booljs('com.example.api').readConfigurations(done);
    });

    it('return a promise', function(){
        return booljs('com.example.api2').setBase(
            'example'
        ).readConfigurations();
    });
});
