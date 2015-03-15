/**
 * Created by mattiden on 04.03.15.
 */
var db = require('./../../config/db.js');
var sendInvitationTo = require('./db_handlers/dbSendInvitationTo');
var getSerializedAppointment = require('./db_handlers/dbGetAppointmentDetails');
var updateAllParticipants = require('./helpers/helperUpdateAllSockets');
var sendNotificationTo = require('./helpers/helperSendInvitationNotification');

module.exports = function(socket, io){
    socket.on('invitation:send', function(invitationInfo, callback){
        var invite = {
            "user_id": invitationInfo.user_id,
            "appointment_id": invitationInfo.appointment_id
        };
        sendInvitationTo([invite.user_id], invite.appointment_id, function(){

            getSerializedAppointment(invite.appointment_id, function(serializedAppointment){

                updateAllParticipants(socket, io, serializedAppointment,function(){

                    sendNotificationTo(socket, io, invite.appointment_id, [invite], function(){
                        if(typeof(callback) === typeof(Function)) callback();
                    })
                })
            })
        })
    });
};