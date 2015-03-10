/**
 * Created by mattiden on 28.02.15.
 */
var socketioJwt = require('socketio-jwt');
var socketPool = require('./socketPool.js');
var settings = require('./../config/settings.js');
var newAppointmentRoute = require('./handler/newAppointmentHandler');
var sendInitialData = require('./handler/sendInititalData');
var sendInvitation = require('./handler/sendInvitationHandler');
var db = require('./../config/db.js');

module.exports = function(io){
    io.set('authorization', socketioJwt.authorize({
        secret: settings.secret,
        handshake: true
    }));
    io.on('connection', function(socket){
        console.log("New connection");
        // Socket pool handler
        socketPool.addSocketToPool(socket);
        socket.on('disconnect', function(){
            console.log("Socket disconnected");
            socketPool.removeSocket(socket);
        });
        //Routes
        sendInvitation(socket, io);
        sendInitialData(socket);
        newAppointmentRoute(socket);
        // ============= REMOVE ASAP ZULU HONOLULU ===============
        /* socket.on('appointment:get', function(payload, callback){
            var appointment = {"title": "Du fikk dette", "date": "15.3.2015"};
            io.to(socketPool.findSocketByUserId(1).id).emit('appointment:get', appointment);
            if(typeof callback === typeof(Function)){
                callback('Sent');
            }
        });
        socket.on('appointment:push', function(payload, callback){
            console.log(payload);
            if(typeof callback === typeof(Function)){
                callback('Sent');
            }
        }); */

        // =======================================================
    });
};