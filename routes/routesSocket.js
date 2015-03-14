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

var db = require('./../config/db.js');

module.exports = function(io){
    io.set('authorization', socketioJwt.authorize({
        secret: settings.secret,
        handshake: true
    }));
    io.on('connection', function(socket){
        // Socket pool handler
        socketPool.addSocketToPool(socket);
        socket.on('disconnect', function(){
            socketPool.removeSocket(socket);
        });
        //Routes
        sendInvitation(socket, io);
        sendInitialData(socket);
        newAppointmentRoute(socket, io);
        updateAppointment(socket, io);
        answerInvitation(socket, io);
    });
};