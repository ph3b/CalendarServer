/**
 * Created by mattiden on 12.03.15.
 */
var updateAppointment = require('./db_handlers/dbUpdateAppointment');
var db = require('./../../config/db.js');
var getSerializedAppointment = require('./db_handlers/dbGetAppointmentDetails');
var socketPool = require('./../socketPool');


module.exports = function(socket, io){
    socket.on('appointment:update', function(changedApp, callback){
        updateAppointment(changedApp, function(){
            getSerializedAppointment(changedApp.appointment_id, function(appointment){
                socket.emit('appointment:get', appointment);
                if(appointment.participants.length > 0){
                    appointment.participants.forEach(function(participant){
                        var sendInvitationToSocket = socketPool.findSocketByUserId(participant.user_id);
                        if(sendInvitationToSocket !== -1){
                            io.to(sendInvitationToSocket.id).emit('appointment:get', appointment);
                        }
                    })
                }
                var message = { "message" : "added", "status": 200}
                if(typeof(callback) === typeof(Function)) callback(message);
            })
        })
    })
};