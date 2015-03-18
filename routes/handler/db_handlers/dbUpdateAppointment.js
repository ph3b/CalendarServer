/**
 * Created by mattiden on 12.03.15.
 */
var jwt = require('jsonwebtoken');
var settings = require('../../../config/settings.js');
var db = require('./../../../config/db.js');
var getParticpantChanges = require('./formatGetParticipantChanges');

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
    db.query(query, appointment, function(err){
        if(!err){
            getParticpantChanges(newAppointment.appointment_id, newAppointment.participants, function(action, addedParticipants, removedParticipants){
               switch(action){
                   case 'nothing':
                       if(typeof(callback) === typeof(Function)) callback(null, null);
                       break;
                   case 'add':
                       if(typeof(callback) === typeof(Function)) callback(addedParticipants, null);
                       break;
                   case 'remove':
                       if(typeof(callback) === typeof(Function)) callback(null, removedParticipants);
                       break;
                   case 'addAndRemove':
                       if(typeof(callback) === typeof(Function)) callback(addedParticipants, removedParticipants);
                       break;
                   default :
                       if(typeof(callback) === typeof(Function)) callback(null, null);
               }
            })
        }
    })
};