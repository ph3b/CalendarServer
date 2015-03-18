/**
 * Created by mattiden on 18.03.15.
 */
/**
 * Created by mattiden on 15.03.15.
 */
var socketPool = require('./../../socketPool.js');

module.exports = function(socket, io, appointment_id, listOfUSersToSendTo, callback){
    var message;
    if(listOfUSersToSendTo !== null){

        listOfUSersToSendTo.forEach(function(user_id){

            var sendInvitationToSocket = socketPool.findSocketByUserId(parseInt(user_id));
            if(sendInvitationToSocket !== -1){
                io.to(sendInvitationToSocket.id).emit('appointment:delete', appointment_id)
            }
        });
        message  = {"message": "ok", "status": 200};
        if(typeof(callback) === typeof(Function)) callback(message);
    } else  {
        message  = {"message": "ok", "status": 200};
        if(typeof(callback) === typeof(Function)) callback(message);
    }

};