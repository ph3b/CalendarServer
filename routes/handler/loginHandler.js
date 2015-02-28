/**
 * Created by mattiden on 28.02.15.
 */
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var config = require('../../config/config.js');

var users = [
    {"username": "mathias", "password": "tennis"},
    {"username": "erlend", "password": "fotball"}
];

module.exports = function(client){
    client.on('user:login', function(req, callback){
        var message;
        for(var i = 0; i < users.length; i++){
            console.log(users[i])
            if(users[i].username == req.username && users[i].password == req.password){
                var token = jwt.sign({"username": req.username}, config.secret);
                message = { "token": token, "status": 200, "message": "ok"};
                callback(message);
                return;
            }
        }
        message = {"status": 401, "message": "Invalid credentials"};
        callback(message);
    })
};