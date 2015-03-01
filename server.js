/**
 * Created by mattiden on 28.02.15.
 */
module.exports = function(mode){
    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var settings = require('./config/settings');
    require('./routes/socketRoutes.js')(io);

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
    });
};
