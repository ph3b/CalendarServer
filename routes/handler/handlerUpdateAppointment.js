/**
 * Created by mattiden on 12.03.15.
 */
var updateAppointment = require('./db_handlers/dbUpdateAppointment');
var db = require('./../../config/db.js');


module.exports = function(socket){
    socket.on('appointment:update', function(updatedAppointment){
        updatedAppointment(updatedAppointment, function(res){
            db.query('select from cal_appointment where appointment_id = ?', updatedAppointment.appointment_id, function(err, res){
                socket.emit('appointment:get', res[0]);
            })
        })
    })
};