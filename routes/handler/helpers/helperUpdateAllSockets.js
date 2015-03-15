/**
 * Created by mattiden on 15.03.15.
 */
var socketPool = require('./../../socketPool.js');

module.exports = function(socket, io, appointment, callback){
    var copyApp = JSON.parse(JSON.stringify(appointment));
    if(copyApp.participants.length > 0){
        copyApp.participants.forEach(function(participant){

            var sendInvitationToSocket = socketPool.findSocketByUserId(participant.user_id);
            if(sendInvitationToSocket !== -1){
                if(participant.invite_accepted !== 2){
                    io.to(sendInvitationToSocket.id).emit('appointment:get', copyApp)
                }
            }
        });
    }
    var ownerSocket = socketPool.findSocketByUserId(copyApp.owned_by_user);
    if(ownerSocket !== -1){
        io.to(ownerSocket.id).emit('appointment:get', copyApp);
    }

    var message  = {"message": "ok", "status": 200};
    if(typeof(callback) === typeof(Function)) callback(message);
};