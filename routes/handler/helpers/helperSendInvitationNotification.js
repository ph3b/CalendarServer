/**
 * Created by mattiden on 15.03.15.
 */
var socketPool = require('./../../socketPool');
var getSerializedAppointment = require('./../db_handlers/dbGetAppointmentDetails');

module.exports = function(socket, io, appointment_id, listOfUsers, callback){
    getSerializedAppointment(appointment_id, function(serializedAppointment){
        var invitationMessage = {
            "title" : serializedAppointment.title,
            "date" : serializedAppointment.date,
            "description" : serializedAppointment.description
        };
        listOfUsers.forEach(function(user){
            var userSocket = socketPool.findSocketByUserId((user.user_id));
            if(userSocket !== -1){
                io.to(userSocket.id).emit("notification", invitationMessage);
            }
        });
        if(typeof(callback) === typeof(Function)) callback();
    })
};