module.exports = function(app, express){

    app = require('./routers/express')(app, express);
    //app = require('./routers/oauth2')(app);
    app = require('./routers/middleware')(app);

    return app;

};
