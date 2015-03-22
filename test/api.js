var booljs = require('..');

describe('API', function(){

    it('initializes application instance', function(done){

        try{
            booljs('com.example.api').setBase('sample');
            done();
        } catch(err){
            done(err);
        }

    });

});
