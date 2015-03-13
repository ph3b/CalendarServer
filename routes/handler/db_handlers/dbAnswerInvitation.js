/**
 * Created by mattiden on 13.03.15.
 */
var db = require('./../../../config/db');

module.exports = function(app_id, answer, callback){
    var query = "update cal_userInvitedToAppointment";
    query += " set invite_accepted = ?";
    query += " where appointment_id = ?";

    db.query(query, [answer, app_id], function(err, res){
        if(typeof(callback) === typeof(Function)) callback();
    });
};