/**
 * Created by mattiden on 28.02.15.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./routes/socketRoutes.js')(io);

var port = 3000;

http.listen(port, function(){
    console.log("Server listening on port: " + port);
});