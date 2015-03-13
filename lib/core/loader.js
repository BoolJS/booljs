var fs = require('fs'),
    util = require('util'),
    crypto = require('crypto'),

    express = require('express'),
    passport = require('passport'),
    oauth2orize = require('oauth2orize');

    jsonfile = require('jsonfile'),
    path = require("path");

var utils = {

    util: util,
    crypto: crypto,

    oauth2orize: oauth2orize,
    passport: passport

};

function loadComponents(app, componentName){

    var component = {};

    var files = fs.readdirSync(componentName, { followLinks: false });

    for(file in files){

        var filename = files[file].split(".");
        var comp = filename[0];
        var ext = filename[1];

        if(ext != 'js'){
            continue;
        }

        var route = util.format("%s/%s", componentName, comp);
        log.info("Loading %s.%s", route, ext);

        route = path.join(PATH, route);

        var exported = require(route)(app);

        var object = _.object([[comp, exported]])
        component = _.extend(component, object);
    }

    return component;

}

function loadConfigs(app){

    var componentName = 'config';

    var component = {};

    var files = fs.readdirSync(componentName, { followLinks: false });

    for(file in files){

        var filename = files[file].split(".");
        var comp = filename[0];
        var ext = filename[1];

        if(ext != 'json'){
            continue;
        }

        var route = util.format("%s/%s.%s", componentName, comp, ext);
        log.info("Loading %s", route);

        var exported = jsonfile.readFileSync(route);

        var object = _.object([[comp, exported]])
        component = _.extend(component, object);
    }

    return component;

}

module.exports = (function(){

    var loaders = ['dao', 'controllers', 'routes', 'security'];

    var app = {
        utils: utils,
        express: express
    };

    /* */
    app.config = loadConfigs(app);

    app = require("./database")(app);
    /* */

    for(loader in loaders){

        loader = loaders[loader];
        var obj = loadComponents(app, loader);

        var ns = _.object([[loader, obj]]);
        app = _.extend(app, ns);

    }

    return app;

})();
