'use strict';

var isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
    log: function(type, name){
        if(isDevelopment) log.info("Loading %s %s", name, type);
    },
    error: function(type, name, err){
        if(isDevelopment) log.error(
            "Failed to load %s %s. Reason: %s", name, type, err
        );
    }
};
