/**
 * Created by mattiden on 13.03.15.
 */

var answerInvitation = require('./db_handlers/dbAnswerInvitation');
var getSerializedAppointments = require('./db_handlers/dbGetAppointmentDetails');

module.exports = function(socket){
    socket.on('invitation:reply', function(answer){
        var apppointment_id = answer.appointment_id;
        var reply = answer.invite_accepted;
        answerInvitation(apppointment_id, reply, function(){
            getSerializedAppointments(appointment_id, function(serializedAppointment){
                socket.emit('appointment:get', serializedAppointment);
            })
        })
    })
};