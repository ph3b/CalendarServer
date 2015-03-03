/**
 * Created by mattiden on 28.02.15.
 */
var socketioJwt = require('socketio-jwt');
var socketPool = require('./socketPool.js');
var settings = require('./../config/settings.js');
var newAppointmentRoute = require('./handler/newAppointmentHandler');
var sendAllAppointments = require('./handler/sendInitialAppointmentsHandler');

module.exports = function(io){
    io.set('authorization', socketioJwt.authorize({
        secret: settings.secret,
        handshake: true
    }));
    io.on('connection', function(socket){
        socketPool.addSocketToPool(socket);
        socket.on('disconnect', function(){
            socketPool.removeSocket(socket);
        });
        //Routes

        sendAllAppointments(socket);
        newAppointmentRoute(socket);
        //Socket socketPool


        // ============= REMOVE ASAP ZULU ================
        socket.on('appointment:get', function(){
            console.log('hellooo');
            var appointment = {"title":"Du fikk dette", "date": "15.2.2015"};
            io.to(socketPool.findSocketByUserId(1).id).emit('appointment:get', appointment);
        })
        // =======================================================
    });
};