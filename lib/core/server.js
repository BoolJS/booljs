var bodyParser = require('body-parser');

module.exports = function(app){

    var srv = app.express();

    srv.use(function(req, res, next){
        res.header("X-Powered-By", "Bool Inc. MVC Framework v1.0.1");
        next();
    });
    srv.set('host', process.env.HOSTNAME || '0.0.0.0');
    srv.set('port', process.env.PORT || 3002);
    srv.use(bodyParser.urlencoded({extended: true}));
    srv.use(bodyParser.json());

    srv.use(app.utils.passport.initialize());
    app = require('./router')(app, app.express);
    srv.use(app.router);

    return srv;

};



/*

== FRAMEWORK == [ // Dominio General

    == TOOLKIT A == // Archivos
    == TOOLKIT B == // Red
    ···
    == COMPONENTE X == // Conectarse a DB Oracle
    ···
    == TOOLKIT Z == [ // Rep Multimedia

        == COMPONENTE B ==
        == COMPONENTE C ==
         ····
        === COMPONENTE A === [
            == PAQUETE A ==
            == PAQUETE B ==
             ····
            == PAQUETE Z == [
                ClaseA
                ClaseB
                ···
                ClaseZ // Dominio Especifico
            ]
        ]

    ]

]

==================================================

FRAMEWORK     ^     GENERICO // OS X
              |
TOOLKIT       |     // Windows Media Player
              |
COMPONENTE    |
              |
PAQUETE       |
              |
CLASE         |     ESPECIFICO // Hola mundo

==================================================

        |                             ^
        | REQUEST                     | RESPONSE
        |                             |
        |                             |
        |                             |
 +------|---------------------+-------|--------+
 |      |                     |       |        |
 |      |                     |       |        |
 |      v                     |       |        |
 |      ROUTER                |       |        |
 |      |                     |       |        |
 +------|---------------------+       |        |
 |      |                     |       |        |
 |      |                     |       |        |
 |      v          DatoFinal-----> VIEW        |
 |      CONTROLLER ^          |                |
 |      |          |          |                |
 +------|----------|----------+                |
 |      |          |          |                |
 |      |       Dato          |                |
 |      v        ^            |                |
 |      DAO      |            |                |
 +------|--------|------------+                |
 |      |        |            |                |
 |      |        |            |                |
 |      v        |            |                |
 |      MODEL                 |                |
 +----------------------------+----------------+

==================================================


    ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓ ▓▓  ▓▓
    ▓     ▓  ▓▓▓       ▓▓         ▓▓  ▓▓
    ▓     ▓  ▓▓▓       ▓▓         ▓▓  ▓▓
    ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓  ▓▓         ▓▓  ▓▓
    ▓     ▓       ▓▓▓  ▓▓         ▓▓  ▓▓
    ▓     ▓       ▓▓▓  ▓▓         ▓▓  ▓▓
    ▓     ▓  ▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓ ▓▓  ▓▓


*/
