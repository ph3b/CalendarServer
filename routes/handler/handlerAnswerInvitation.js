/**
 * Created by mattiden on 13.03.15.
 */

var answerInvitation = require('./db_handlers/dbAnswerInvitation');
var getSerializedAppointments = require('./db_handlers/dbGetAppointmentDetails');
var socketPool = require('./../socketPool');
var db = require('./../../config/db.js');
jwt = require('jsonwebtoken');
var settings = require('../../config/settings.js');


module.exports = function(socket,io){
    socket.on("invitation:reply", function(answer, callback){
        var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;
        var appointment_id = answer.appointment_id;
        var reply = answer.invite_accepted;
        answerInvitation(appointment_id, reply, user_id, function(owner_id){
            getSerializedAppointments(appointment_id, function(serialApp){
                var copyApp = JSON.parse(JSON.stringify(serialApp));
                var hei = "SHALLABAIA";

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
                var ownerSocket = socketPool.findSocketByUserId(owner_id);
                if(ownerSocket !== -1){
                    io.to(ownerSocket.id).emit('appointment:get', serialApp);
                }
                var message  = {"message": "ok", "status": 200};
                if(typeof(callback) === typeof(Function)) callback(message);
            })
        })
    })
};