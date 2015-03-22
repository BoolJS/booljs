var booljs = require('..');

describe('Folders', function(){

    it('Reads folders and creates initial pre-structure', function(done){

        booljs('com.example.api').readFiles(done);
    });

    it('Read folders returns a promise', function(done){

        booljs('com.example.api').readFiles().then(function(){
            done();
        }).catch(done);
    });

});
