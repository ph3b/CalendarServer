/**
 * Created by mattiden on 28.02.15.
 */
module.exports = function(mode){
    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var bodyParser = require('body-parser');
    var cors = require('cors');
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    require('./routes/routesSocket.js')(io);
    require('./routes/routesHttp.js')(app);

    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        var port = 3000;
        switch(mode){
            case 'test':
                ip = '0.0.0.0';
                port = 3000;
                break;
            default :
                ip = add;
                port = 4000;
        }
        http.listen(port, ip);
        console.log('Server running on: ' + ip + ':' + port);
    });
};
