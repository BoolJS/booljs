'use strict';

module.exports = function(type, name){

    if(process.env.NODE_ENV === "development"){
        log.info("Loading %s %s", name, type);
    }

};
