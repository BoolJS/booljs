var booljs = require('..');

describe('Configurations', function(){

    it('Loads configurations from samples folder', function(done){

        var files = ["db"];

        booljs.readFiles(function(err, name){

            if(err) done(err);
            else {

                if(_.contains(files, name)){
                    var index = files.indexOf(name);
                    if(index !== -1){
                        files.splice(index, 1);
                    }
                } else {
                    done(
                        new Error(
                            "Filename was not in the folder, but was read"
                        )
                    );
                }

                if(files.length == 0){
                    done();
                }

            }

        });

    });

});
