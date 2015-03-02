/**
 * Created by mattiden on 02.03.15.
 */
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../config/settings.js');

var users = [
    {"username": "mathias", "password": "tennis"},
    {"username": "erlend", "password": "fotball"}
];

module.exports = function(req, res){
    var message;
    for(var i = 0; i < users.length; i++){
        if(users[i].username == req.body.username && users[i].password == req.body.password){
            var token = jwt.sign({"username": req.body.username}, settings.secret);
            message = { "token": token, "status": 200, "message": "ok"};
            res.send(message);
            res.end();
            return;
        }
    }
    message = {"status": 401, "message": "Invalid credentials"};
    res.send(message);
};