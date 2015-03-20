/**
 * Created by mattiden on 28.02.15.
 */
var socketioJwt = require('socketio-jwt');
var socketPool = require('./socketPool.js');
var settings = require('./../config/settings.js');
var newAppointmentRoute = require('./handler/handlerNewAppointment');
var sendInitialData = require('./handler/handlerSendInititalData');
var sendInvitation = require('./handler/handlerSendInvitation');
var updateAppointment = require('./handler/handlerUpdateAppointment');
var answerInvitation = require('./handler/handlerAnswerInvitation');
var deleteAppointment = require('./handler/handlerDeleteAppointment');
var db = require('./../config/db.js');

module.exports = function(io){
    // This checks if client connects with a valid JWT-token signed with our secret.
    // Only clients with valid tokens are able to create a socket connection.
    io.set('authorization', socketioJwt.authorize({
        secret: settings.secret,
        handshake: true
    }));

    io.on('connection', function(socket){
        // Socket pool handler
        // This pool controls all connected socket. Each socket is identified by user_id
        socketPool.addSocketToPool(socket);
        socket.on('disconnect', function(){
            socketPool.removeSocket(socket);
        });
        //Socket routes
        sendInvitation(socket, io);         // invitation:send
        answerInvitation(socket, io);       // invitation:reply
        sendInitialData(socket);            // appointment:initialreceive
        newAppointmentRoute(socket, io);    // appointment:new
        updateAppointment(socket, io);      // appointment:update
        deleteAppointment(socket, io);      // appointment:delete
    });
};