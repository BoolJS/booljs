global = require('../bin/bool');

describe('API', function(){

    it('Only have an error in API', function(done){
        var apiKeys = Object.keys(Bool);
        expect(apiKeys).to.eql(['Error']);
        done();
    });

});
