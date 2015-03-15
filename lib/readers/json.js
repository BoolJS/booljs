'use strict';

module.exports = {
    read: function(route, callback){
        var json = require('jsonfile');
        json.readFile(route, callback);
    },
    validExtension: "json"
};
