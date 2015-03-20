/**
 * Created by mattiden on 15.03.15.
 */
var socketPool = require('./../../socketPool');
var getSerializedAppointment = require('./../db_handlers/dbGetAppointmentDetails');
var settings = require('./../../../config/settings');
var db = require('./../../../config/db');
var jwt = require('jsonwebtoken');

module.exports = function(socket, io, appointment_id, listOfUsers, callback){
    var formattedAddedUsers = [];
    if(listOfUsers !== null){
        listOfUsers.forEach(function(user_id){
            formattedAddedUsers.push(parseInt(user_id));
        });
    } else {
        formattedAddedUsers = null;
    }
    if(listOfUsers !== null){
        getSerializedAppointment(appointment_id, function(serializedAppointment){
            var invitationMessage = {
                "title" : serializedAppointment.title,
                "date" : serializedAppointment.date,
                "sender" : jwt.decode(socket.handshake.query.token, settings.secret).username
            };
            formattedAddedUsers.forEach(function(user_id){
                var userSocket = socketPool.findSocketByUserId(user_id);
                if(userSocket !== -1){
                    io.to(userSocket.id).emit('invite:new', invitationMessage);
                }
            });
            if(typeof(callback) === typeof(Function)) callback();
        })
    }
    else {
        if(typeof(callback) === typeof(Function)) callback();
    }
};