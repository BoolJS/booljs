module.exports = function(app){

    var router = app.router,
        log = app.utils.log;

    // Log Middleware: Log Client Requests
    router.use(function(req, res, next) {
        log.info(req.method, req.path);
        next();
    });

    // 404 Middleware: Final Middleware matches routes that aren't registered
    router.use(function(req, res) {
        res.status(404);
        var responseView = require('../../views/jsonErrorResponse');
        responseView({ "message": "Method not found" }, res);
    });

    // Error Middleware: Matches Server Error Routes
    router.use(function(err, req, res, next){
        log.error("%s %j", err, err);
        var responseView = require('../../views/jsonErrorResponse');
        responseView(err, res);
    });

    app.router = router;
    return app;

}
