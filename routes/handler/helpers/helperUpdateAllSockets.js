/**
 * Created by mattiden on 15.03.15.
 */
var socketPool = require('./../../socketPool.js');

module.exports = function(socket, io, appointment, callback){
    if(appointment.participants.length > 0){

        appointment.participants.forEach(function(participant){

            var sendInvitationToSocket = socketPool.findSocketByUserId(participant.user_id);

            if(sendInvitationToSocket !== -1){
                if(participant.invite_accepted !== 2){
                    io.to(sendInvitationToSocket.id).emit('appointment:get', appointment)
                }
            }
        });
    }

    var ownerSocket = socketPool.findSocketByUserId(appointment.owned_by_user);
    if(ownerSocket !== -1){
        io.to(ownerSocket.id).emit('appointment:get', appointment);
    }

    var message  = {"message": "ok", "status": 200};
    if(typeof(callback) === typeof(Function)) callback(message);
};