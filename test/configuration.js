/* global describe, before, it */
'use strict';

describe('Configuration', function(){
    var booljs;

    before(function(){
        booljs = require('..');
    });

    it('Reads and loads configuration files into instance', function(done){
        booljs('com.example.api').readConfigurations(done);
    });

    it('Reads configurations returning a promise', function(){
        return booljs('com.new.api').setBase('example').readConfigurations();
    });
});
