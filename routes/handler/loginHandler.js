/**
 * Created by mattiden on 02.03.15.
 */
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../config/settings.js');
var db = require('./../../config/db.js');

var users = [
    {"username": "mathias", "password": "tennis"},
    {"username": "erlend", "password": "fotball"}
];

module.exports = function(req, res){
    var message;
    var user = {"username": req.body.username, "password": req.body.password};
    db.query("select * from cal_user where username = ?", user.username, function(err, response){
        if(err){
            res.send(err)
            return;
        }
        if(response.length && response[0].password === user.password){
            var token = jwt.sign({"username": user.username, "user_id" : response[0].user_id}, settings.secret);
            message = { "token": token, "status": 200, "message": "ok"};
            res.send(message);
            res.end();
            return;
        }
        message = {"status": 401, "message": "Invalid credentials"};
        res.send(message);
    });

};