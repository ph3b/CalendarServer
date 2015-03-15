var jwt = require('jsonwebtoken');
var settings = require('../../config/settings.js');
var db = require('./../../config/db.js');
var newAppointment = require('./db_handlers/dbNewAppointment');
var getSerializedAppointment = require('./db_handlers/dbGetAppointmentDetails');
var updateAllParticipants = require('./helpers/helperUpdateAllSockets');

module.exports = function(socket, io){
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

            getSerializedAppointment(addedAppointment.appointment_id, function(appointment2){

                updateAllParticipants(socket, io, appointment2,function(){

                    if(typeof(callback) === typeof(Function)) callback(message);
                })
            });
        })
    })
};