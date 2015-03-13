/**
 * Created by mattiden on 12.03.15.
 */
var updateAppointment = require('./db_handlers/dbUpdateAppointment');
var db = require('./../../config/db.js');
var getSerializedAppointment = require('./db_handlers/dbGetAppointmentDetails');


module.exports = function(socket){
    socket.on('appointment:update', function(changedApp){
        updateAppointment(changedApp, function(res){
            getSerializedAppointment(changedApp.appointment_id, function(appointment){
                socket.emit('appointment:get', appointment);
            })
        })
    })
};