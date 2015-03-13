module.exports = function(app){

    var sockets = app.utils.sockets;
    sockets.setAuthorization(app.dao.sockets.authorization);

    for(evtModule in app.events){

        var eventModule = app.events[evtModule];

        sockets.registerNamespace(
            evtModule,
            eventModule.connect,
            eventModule.disconnect
        );

        for(evt in eventModule.events){
            var event = eventModule.events[evt];
            sockets.registerEvent(evtModule, event.tag, event.event);
        }

    }

    return app;

};
