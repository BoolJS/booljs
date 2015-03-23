'use strict';

describe('Configuration', function(){

    var booljs = require('..');

    it('Reads and loads configuration files into instance', function(done){
        booljs('com.example.api').readConfigurations(done);
    });

    it('Reads configurations returning a promise', function(done){
        booljs('com.example.api').readConfigurations().catch(function(){
            done();
        });
    });

});
