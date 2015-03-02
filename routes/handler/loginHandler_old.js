/**
 * Created by mattiden on 28.02.15.
 */
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../config/settings.js');
var socketioJwt = require('socketio-jwt');


var users = [
    {"username": "mathias", "password": "tennis"},
    {"username": "erlend", "password": "fotball"}
];

module.exports = function(socket){
    socket.on('user:login', function(req, res){
        var message;
        for(var i = 0; i < users.length; i++){
            if(users[i].username == req.username && users[i].password == req.password){
                var token = jwt.sign({"username": req.username}, settings.secret);
                message = { "token": token, "status": 200, "message": "ok"};
                res(message);
                return;
            }
        }
        message = {"status": 401, "message": "Invalid credentials"};
        res(message);
    });
};