module.exports = function(app, express){

    var log = app.utils.log,
        cors = app.utils.cors,
        passport = app.utils.passport,

        approutes = app.routes,

        router = express.Router();

    // CORS Middleware: Match URL Route and HTTP Method with CORS enabled.
    router.options('*', cors.matchUrl, function(req, res){
        res.json(200, {});
    });
    router.use(cors.match);

    for(module in approutes){

        var module = approutes[module];

        for(route in module){
            var rt = module[route];

            if(rt.cors){
                cors.registerRoute(rt.url, rt.method);
            }

            router[rt.method](rt.url,
                /*passport.authenticate('bearer'),*/
                rt.action
            );

        }

    }

    app.router = router;
    return app;


};
