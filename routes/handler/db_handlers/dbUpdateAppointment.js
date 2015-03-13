/**
 * Created by mattiden on 12.03.15.
 */
jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../../config/settings.js');
var db = require('./../../../config/db.js');

module.exports = function(newAppointment, callback){
    var appointment = [
        newAppointment.title,
        newAppointment.date,
        newAppointment.start_time,
        newAppointment.end_time,
        newAppointment.description,
        newAppointment.appointment_id
    ];
    var query = "update cal_appointment";
    query += " set title = ?, date = ?, start_time = ?, end_time = ?, description = ?";
    query += " where cal_appointment.appointment_id = ?";

    db.query(query, appointment, function(err, res){
        if(err){
            console.log(err)
        }
        if(typeof(callback) === typeof(Function)) callback(res);
    })
};