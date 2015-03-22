var booljs = require('..');

describe('Folders', function(){

    it('Reads folders and creates initial pre-structure', function(done){

        booljs('com.example.api').readFiles(done);
    });

});
