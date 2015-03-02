/**
 * Created by mattiden on 28.02.15.
 */
module.exports = function(mode){
    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var bodyParser = require('body-parser');

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    require('./routes/socketRoutes.js')(io);
    require('./routes/restRoutes.js')(app);

    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        var port = 3000;
        switch(mode){
            case 'test':
                ip = 'localhost';
                break;
            default :
                ip = add;
        }
        http.listen(port, ip);
        console.log('Server running on: ' + ip + ':' + port);
        console.log(process.env.global);
    });
};
