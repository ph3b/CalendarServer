jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../config/settings.js');
var db = require('./../../config/db.js');
var newAppointment = require('./db_handlers/newAppointment');

module.exports = function(socket){
    socket.on('appointment:new', function(req, callback){
        var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;

        var appointment = {
            "title": req.title,
            "date": req.date,
            "start_time": req.start_time,
            "end_time" : req.end_time,
            "owned_by_user": user_id,
            "description" : req.description
        };
        newAppointment(appointment,req, socket, function(res){
            if(typeof(callback) === typeof(Function)) callback(res);
        })
    })
};