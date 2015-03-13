module.exports = function(app){

    var cors = app.utils.cors,
        router = app.router;

    // Passport OAuth2.0 Strategies Registering
    /*var oauth2 = app.security.oauth2;
    oauth2.endpoint(app);

    // Register Authorization Server
    cors.registerRoute('/auth/token', 'post');
    router.post('/auth/token', oauth2.server(app));

    app.router = router;
    return app;*/

}
