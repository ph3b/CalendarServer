jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../config/settings.js');
var db = require('./../../config/db.js');
var newAppointment = require('./db_handlers/dbNewAppointment');
var getSerializedAppointment = require('./db_handlers/dbGetAppointmentDetails');


module.exports = function(socket){
    socket.on('appointment:new', function(req, callback){
        var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;
        var appointment = {
            "title": req.title,
            "date": req.date,
            "start_time": req.start_time,
            "end_time" : req.end_time,
            "owned_by_user": user_id,
            "description" : req.description,
            "participants" : req.participants
        };
        newAppointment(appointment, function(message, addedAppointment){
            getSerializedAppointment(addedAppointment.appointment_id, function(serializedAddedApp){
                socket.emit('appointment:get', serializedAddedApp);
                if(typeof(callback) === typeof(Function)) callback(message);
            });
        })
    })
};