/**
 * Created by mattiden on 12.03.15.
 */
var db = require('./../../config/db.js');

var updateAppointmentWithNewData = require('./db_handlers/dbUpdateAppointment');
var getTheNewSerializedAppoint = require('./db_handlers/dbGetAppointmentDetails');
var updateAllRelevantClients = require('./helpers/helperUpdateAllSockets');
var uninviteRemovedUsers = require('./db_handlers/dbDeleteInvitations');
var tellUninvitedUsersToDeleteAppointment = require('./helpers/sendDeleteAppointmentToSocket');
var inviteAddedUsers = require('./db_handlers/dbSendInvitationTo');
var sendNotificationToAddedUsers = require('./helpers/helperSendInvitationNotification');

// This handler updates an existing appointment. Sends the new version of the appointment to all relevant clients (invited or owner).
// It will also have to tell deleted participants that they should clear their local storage of this appointment.

module.exports = function(socket, io){
    socket.on('appointment:update', function(editedAppointment, callback){
        updateAppointmentWithNewData(editedAppointment, function(addedUsers, removedUsers){
            inviteAddedUsers(addedUsers, editedAppointment.appointment_id, function(){
                uninviteRemovedUsers(removedUsers, editedAppointment.appointment_id, function(){
                    getTheNewSerializedAppoint(editedAppointment.appointment_id, function(editedSerializedAppointment){
                        updateAllRelevantClients(socket, io, editedSerializedAppointment, function(){
                            tellUninvitedUsersToDeleteAppointment(socket, io, editedAppointment.appointment_id, removedUsers, function(){
                                sendNotificationToAddedUsers(socket, io, editedAppointment.appointment_id, addedUsers, function(){
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