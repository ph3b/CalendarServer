/**
 * Created by mattiden on 18.03.15.
 */
var tellParticipantsThatThisAppointmentIsDeleted = require('./helpers/sendDeleteAppointmentToSocket');
var deleteAppointment = require('./db_handlers/dbDeleteAppointment');
var getSerializedAppointment = require('./db_handlers/dbGetAppointmentDetails');
var format = require('./helpers/helperParticipantList');

module.exports = function(socket, io){
    socket.on('appointment:delete', function(appointment_id){
        getSerializedAppointment(appointment_id, function(serializedAppointment){

            var user_list = format.formatList(serializedAppointment.participants);

            tellParticipantsThatThisAppointmentIsDeleted(socket, io, appointment_id, user_list, function(){
                deleteAppointment(appointment_id, function(){
                    socket.emit('appointment:delete', appointment_id);
                })
            })
        });
    })
};