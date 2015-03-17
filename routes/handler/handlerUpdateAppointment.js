/**
 * Created by mattiden on 12.03.15.
 */
var updateAppointment = require('./db_handlers/dbUpdateAppointment');
var db = require('./../../config/db.js');
var getSerializedAppointment = require('./db_handlers/dbGetAppointmentDetails');
var updateAllParticipants = require('./helpers/helperUpdateAllSockets');

module.exports = function(socket, io){
    socket.on('appointment:update', function(changedApp, callback){
        var removedUsers = [];
        var addedUsers = [];
        console.log(changedApp);
        getSerializedAppointment(changedApp.appointment_id, function(appointment){
            console.log(appointment);
        });

        updateAppointment(changedApp, function(){
            getSerializedAppointment(changedApp.appointment_id, function(appointment){
                updateAllParticipants(socket, io, appointment, function(){
                    var message = { "message" : "added", "status": 200};
                    if(typeof(callback) === typeof(Function)) callback(message);
                })
            })
        })
    })
};