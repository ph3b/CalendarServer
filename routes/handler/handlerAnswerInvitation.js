/**
 * Created by mattiden on 13.03.15.
 */
var answerInvitation = require('./db_handlers/dbAnswerInvitation');
var getSerializedAppointments = require('./db_handlers/dbGetAppointmentDetails');
var db = require('./../../config/db.js');
var jwt = require('jsonwebtoken');
var settings = require('../../config/settings.js');
var updateAllParticipants = require('./helpers/helperUpdateAllSockets');

module.exports = function(socket,io){
    socket.on("invitation:reply", function(answer, callback){

        var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;
        var appointment_id = answer.appointment_id;
        var reply = answer.invite_accepted;

        answerInvitation(appointment_id, reply, user_id, function(owner_id){
            getSerializedAppointments(appointment_id, function(appointment){
                updateAllParticipants(socket, io, appointment, function(){
                    var message  = {"message": "ok", "status": 200};
                    if(typeof(callback) === typeof(Function)) callback(message);
                })
            })
        })
    })
};