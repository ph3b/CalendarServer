/**
 * Created by mattiden on 28.02.15.
 */
var socketioJwt = require('socketio-jwt');
var pool = require('./socketPool.js');
var settings = require('./../config/settings.js');
var newAppointmentRoute = require('./handler/newAppointmentHandler');
var sendAllAppointments = require('./handler/sendInitialAppointmentsHandler');

module.exports = function(io){
    io.set('authorization', socketioJwt.authorize({
        secret: settings.secret,
        handshake: true
    }));
    io.on('connection', function(socket){
        //Routes
        sendAllAppointments(socket);
        newAppointmentRoute(socket);
        //Socket pool
        pool.addSocketToPool(socket);
        socket.on('disconnect', function(){
            pool.removeSocket(socket);
        })

    });




};