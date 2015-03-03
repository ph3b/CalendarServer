/**
 * Created by mattiden on 28.02.15.
 */
var socketioJwt = require('socketio-jwt');
var settings = require('./../config/settings.js');
var newAppointmentRoute = require('./handler/newAppointmentHandler');
var sendInitialAppointmentsRoute = require('./handler/sendInitialAppointmentsHandler');

module.exports = function(io){
    io.set('authorization', socketioJwt.authorize({
        secret: settings.secret,
        handshake: true
    }));
    io.on('connection', function(socket){
        sendInitialAppointmentsRoute(socket);
        newAppointmentRoute(socket);
    });


};