/**
 * Created by mattiden on 13.03.15.
 */
var db = require('./../../../config/db');
var serializeAppointment = require('./../format_handlers/formatSerializeAppointments');

module.exports = function(app_id, callback){
        var sql = "select cal_appointment.appointment_id, cal_appointment.title, cal_appointment.description, cal_appointment.created_date, cal_appointment.owned_by_user,";
        sql += " cal_appointment.date, cal_appointment.start_time, cal_appointment.end_time, invite_accepted, fullname, cal_userInvitedToAppointment.user_id";
        sql += " from cal_appointment left join (cal_userInvitedToAppointment join cal_user)";
        sql += " on(cal_appointment.appointment_id = cal_userInvitedToAppointment.appointment_id and cal_user.user_id = cal_userInvitedToAppointment.user_id)";
        sql += " where cal_appointment.appointment_id = ?";
        db.query(sql, app_id, function(err, unserializedAppointments){
            if(!err){
                serializeAppointment([unserializedAppointments], function(serializedAppointment){
                    if(typeof(callback) === typeof(Function)) callback(serializedAppointment[0]);
                })
            }
        })
};