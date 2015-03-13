/**
 * Created by mattiden on 13.03.15.
 */
module.exports = function(arrayOfAppointments, callback){
    var serializedAppointments = [];
    for(var i = 0; i < arrayOfAppointments.length; i++){
        var appointment = arrayOfAppointments[i][0];
        var participants = [];
        var serializedAppointment = {
            "appointment_id" : appointment.appointment_id,
            "title" : appointment.title,
            "description" : appointment.description,
            "created_date" : appointment.created_date,
            "owned_by_user" : appointment.owned_by_user,
            "date" :    appointment.date,
            "start_time" : appointment.start_time,
            "end_time" : appointment.end_time,
            "participants" : []
        };
        for(var k = 0; k < arrayOfAppointments[i].length; k++){
            var unserializedParticipant = arrayOfAppointments[i][k];
            if(unserializedParticipant.user_id !== null){
                var participant = {
                    "user_id": unserializedParticipant.user_id,
                    "fullname" : unserializedParticipant.fullname,
                    "invite_accepted" : unserializedParticipant.invite_accepted
                };
                participants.push(participant);
            }
        }
        serializedAppointment.participants = participants;
        serializedAppointments.push(serializedAppointment)
    }
    callback(serializedAppointments);
};