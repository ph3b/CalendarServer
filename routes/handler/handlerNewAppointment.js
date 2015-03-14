jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../config/settings.js');
var db = require('./../../config/db.js');
var newAppointment = require('./db_handlers/dbNewAppointment');
var getSerializedAppointment = require('./db_handlers/dbGetAppointmentDetails');
var socketPool = require('./../socketPool.js');


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
            getSerializedAppointment(addedAppointment.appointment_id, function(serializedAddedApp){
                socket.emit('appointment:get', serializedAddedApp);
                if(serializedAddedApp.participants.length > 0){
                    serializedAddedApp.participants.forEach(function(participant){
                        var sendInvitationToSocket = socketPool.findSocketByUserId(participant.user_id);
                        if(sendInvitationToSocket !== -1){
                            io.to(sendInvitationToSocket.id).emit('appointment:get', serializedAddedApp)
                        }
                    })
                }
                if(typeof(callback) === typeof(Function)) callback(message);
            });
        })
    })
};