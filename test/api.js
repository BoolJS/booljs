var booljs = require('..');

describe('API', function(){

    it('initializes application instance', function(done){

        try{
            booljs.init(
                'com.example.api'
            ).baseFolder(
                'sample'
            );
            done();
        } catch(err){
            done(err);
        }

    });

});
