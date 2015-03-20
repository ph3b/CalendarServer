var jwt = require('jsonwebtoken');
var settings = require('../../config/settings.js');
var db = require('./../../config/db.js');
var createNewAppointment = require('./db_handlers/dbNewAppointment');
var getSerializedVersionOfNewAppointment = require('./db_handlers/dbGetAppointmentDetails');
var sendAppointmentToInvitedUsers = require('./helpers/helperUpdateAllSockets');
var sendNotificationsToAllInvitedUsers = require('./helpers/helperSendInvitationNotification');
var format = require('./helpers/helperParticipantList');

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
        createNewAppointment(appointment, function(responseMessage, newUnserializedAppointment){
            getSerializedVersionOfNewAppointment(newUnserializedAppointment.appointment_id, function(newSerializedAppointment){
                sendAppointmentToInvitedUsers(socket, io, newSerializedAppointment,function(){
                    var app_id = newSerializedAppointment.appointment_id;
                    var invitees = format.formatList(newSerializedAppointment.participants);
                    sendNotificationsToAllInvitedUsers(socket, io, app_id, invitees, function(){
                        if(typeof(callback) === typeof(Function)) callback(responseMessage);
                    })
                })
            });
        })
    })
};