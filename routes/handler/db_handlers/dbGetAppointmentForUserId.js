/**
 * Created by mattiden on 11.03.15.
 */
/**
 * Created by mattiden on 07.03.15.
 */
var db = require('./../../../config/db');
var settings = require('./../../../config/settings.js');
var async = require('async');
var serializeAppointments = require('./../format_handlers/formatSerializeAppointments');

module.exports = function(user_id, callback){
    var asyncTasks = [];

    var query = "select cal_appointment.appointment_id";
    query += " from cal_appointment";
    query += " left join cal_userInvitedToAppointment";
    query += " on(cal_appointment.appointment_id = cal_userInvitedToAppointment.appointment_id)";
    query += " where user_id = ? or owned_by_user = ?";
    query += " group by cal_appointment.appointment_id";

    db.query(query, [user_id, user_id], function(err, appointmentList){
        // Get list of appointments that is relevant for the user
        appointmentList.forEach(function(app_id){
            // Push function that queries db for each appointment to get users invited to this appointment
            // We dont run this yet
            asyncTasks.push(getAppointmentDetails(app_id.appointment_id))
        });
        async.parallel(asyncTasks, function(err, unserializedAppointments){
            serializeAppointments(unserializedAppointments, function(serializedAppointments){
                if(typeof(callback) === typeof(Function)) callback(serializedAppointments);
            });
        });
    });
    var getAppointmentDetails = function(app_id){
        return function(cb){
            var sql = "select cal_appointment.appointment_id, cal_appointment.title, cal_appointment.description, cal_appointment.created_date, cal_appointment.owned_by_user,";
            sql += " cal_appointment.date, cal_appointment.start_time, cal_appointment.end_time, invite_accepted, fullname, cal_userInvitedToAppointment.user_id";
            sql += " from cal_appointment left join (cal_userInvitedToAppointment join cal_user)";
            sql += " on(cal_appointment.appointment_id = cal_userInvitedToAppointment.appointment_id and cal_user.user_id = cal_userInvitedToAppointment.user_id)";
            sql += " where cal_appointment.appointment_id = ?";
            db.query(sql, app_id, function(err, res){
                if(typeof callback === typeof(Function)) cb(err, res);
            })
        }
    };
};