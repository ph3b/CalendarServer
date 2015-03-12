/**
 * Created by mattiden on 11.03.15.
 */
/**
 * Created by mattiden on 07.03.15.
 */
var db = require('./../../../config/db');
var settings = require('./../../../config/settings.js');
var jwt = require('jsonwebtoken');
var async = require('async');

module.exports = function(user_id, callback){
    var appointments = [];
    var serializedAppointments = [];
    var asyncTasks = [];
    var serializeAppointment = function(arrayOfAppointments){
        for(var i = 0; i < arrayOfAppointments.length; i++){
            var appointment = arrayOfAppointments[i][0];
            var participants = [];
            var serializedAppointment = {
                "appointment_id" : appointment.appointment_id,
                "title" : appointment.title,
                "description" : appointment.description,
                "created_date" : appointment.created_date,
                "owned_by_user" : appointment.owned_by_user,
                "date" :    appointment.date,
                "start_time" : appointment.start_time,
                "end_time" : appointment.end_time
            };
            if(arrayOfAppointments[i].length > 1){
                for(var k = 0; k < arrayOfAppointments[i].length; k++){
                    var unserializedParticipant = arrayOfAppointments[i][k];
                    var participant = {
                        "user_id": unserializedParticipant.user_id,
                        "fullname" : unserializedParticipant.fullname,
                        "invite_accepted" : unserializedParticipant.invite_accepted
                    };
                    participants.push(participant);
                }
            }
            serializedAppointment.participants = participants;
            serializedAppointments.push(serializedAppointment)
        }
    };

    var getAppointmentDetails = function(app_id){
        return function(callback){
            var sql = "select cal_appointment.appointment_id, cal_appointment.title, cal_appointment.description, cal_appointment.created_date, cal_appointment.owned_by_user,";
            sql += " cal_appointment.date, cal_appointment.start_time, cal_appointment.end_time, invite_accepted, fullname, cal_userInvitedToAppointment.user_id";
            sql += " from cal_appointment join cal_userInvitedToAppointment join cal_user";
            sql += " on(cal_appointment.appointment_id = cal_userInvitedToAppointment.appointment_id and cal_user.user_id = cal_userInvitedToAppointment.user_id)";
            sql += " where cal_appointment.appointment_id = ?";

            db.query(sql, app_id, function(err, res){
                appointments.push(res);
                if(typeof callback === typeof(Function)) callback();
            })
        }
    };
        var query = "select cal_appointment.appointment_id";
        query += " from cal_appointment";
        query += " join cal_userInvitedToAppointment";
        query += " on(cal_appointment.appointment_id = cal_userInvitedToAppointment.appointment_id)";
        query += " where user_id = ? or owned_by_user = ?";
        query += " group by cal_appointment.appointment_id";

    db.query(query, [user_id, user_id], function(err, res){
        // Get list of appointment that is relevant for the user

        res.forEach(function(app_id){
            // Push function that queries db for each appointment to get users invited to this appointment
            // We dont run this yet
            asyncTasks.push(getAppointmentDetails(app_id.appointment_id))
        });
        async.parallel(asyncTasks, function(){
            serializeAppointment(appointments);
            if(typeof(callback) === typeof(Function)) callback(serializedAppointments);
        });
    });
};