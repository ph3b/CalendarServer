/**
 * Created by mattiden on 04.03.15.
 */
var db = require('./../../config/db.js');
var socketPool = require('./../socketPool.js');


module.exports = function(socket, io){
    socket.on('appointment:sendinvitation', function(invitationInfo, callback){
        var invite = {
            "user_id": invitationInfo.user_id,
            "appointment_id": invitationInfo.appointment_id,
            "invite_accepted":false,
            "read_by_user": false
        };
        db.query('insert into cal_userInvitedToAppointment set ?', invite, function(err, res){
            if(err){
                callback('Error when sending invitation');
            }
            else {
                db.query('select * from cal_appointment where appointment_id=?', invite.appointment_id, function(err, app){
                    // If user is online we will push the new invitation and appointment immediately.
                    // If they are not they will simple fetch them the next time they log in.
                    var sendInvitationToSocket = socketPool.findSocketByUserId(invite.user_id);

                    if(sendInvitationToSocket !== -1){
                        io.to(sendInvitationToSocket.id).emit("appointment:get", app[0]);
                        io.to(sendInvitationToSocket.id).emit("invitation:get", invite);
                        if(typeof callback === 'function'){
                            callback('sent');
                        }
                    }
                    if(typeof callback === 'function'){
                        callback('sent');
                    }
                })
            }
        });
    });
}