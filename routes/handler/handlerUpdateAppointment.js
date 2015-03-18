/**
 * Created by mattiden on 12.03.15.
 */
var updateAppointment = require('./db_handlers/dbUpdateAppointment');
var db = require('./../../config/db.js');
var getSerializedAppointment = require('./db_handlers/dbGetAppointmentDetails');
var updateAllParticipants = require('./helpers/helperUpdateAllSockets');
var uninviteRemovedUsers = require('./db_handlers/dbDeleteInvitations');
var sendDeleteToUninvitedParticipants = require('./helpers/sendDeleteAppointmentToSocket');
var inviteAddedUsers = require('./db_handlers/dbSendInvitationTo');
var sendNotificationTo = require('./helpers/helperSendInvitationNotification');

module.exports = function(socket, io){
    socket.on('appointment:update', function(changedApp, callback){

        updateAppointment(changedApp, function(addedUsers, removedUsers){
            var formattedAddedUsers = [];
            if(addedUsers !== null){
                addedUsers.forEach(function(user_id){
                    formattedAddedUsers.push(parseInt(user_id));
                });
            } else {
                formattedAddedUsers = null;
            }
            inviteAddedUsers(addedUsers, changedApp.appointment_id, function(){
                uninviteRemovedUsers(removedUsers, changedApp.appointment_id, function(){
                    getSerializedAppointment(changedApp.appointment_id, function(appointment){
                        updateAllParticipants(socket, io, appointment, function(){
                            sendDeleteToUninvitedParticipants(socket, io, changedApp.appointment_id, removedUsers, function(){
                                sendNotificationTo(socket, io, changedApp.appointment_id, formattedAddedUsers, function(){
                                    var message = { "message" : "added", "status": 200};
                                    if(typeof(callback) === typeof(Function)) callback(message);
                                })
                            })
                        })
                    })
                })
            })
        })
    })
};