/**
 * Created by mattiden on 13.03.15.
 */
var db = require('./../../../config/db');

module.exports = function(app_id, reply,user_id, callback){
    var query = "update cal_userInvitedToAppointment";
    query += " set invite_accepted = ?";
    query += " where appointment_id = ? and user_id = ?";

    db.query(query, [reply, app_id, user_id], function(err, res){
        if(!err){
            db.query("select * from cal_appointment where appointment_id = ?", app_id, function(err, res){
                if(!err){
                    if(typeof(callback) === typeof(Function)) callback(res[0].owned_by_user);
                }
            })
        }
    });
};