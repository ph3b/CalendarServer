/**
 * Created by mattiden on 17.03.15.
 */
/**
 * Created by mattiden on 07.03.15.
 */
var db = require('./../../../config/db');


module.exports = function(listOfUsersToUninvite, appointment_id, callback){
    if(listOfUsersToUninvite === null){
        if(typeof(callback) === typeof(Function)) callback(1);
        return;
    }
    var query = "delete from cal_userInvitedToAppointment where appointment_id = ?";
    query += " and user_id in(";

    for(var i = 0; i<listOfUsersToUninvite.length; i++){
        if(i === listOfUsersToUninvite.length-1){
            query += listOfUsersToUninvite[i] + ")"
        } else {
            query += listOfUsersToUninvite[i] + ','
        }
    }
    db.query(query, appointment_id,function(err, res){
        if(err){
            if(typeof(callback) === typeof(Function)) callback(0);
        } else {
            if(typeof(callback) === typeof(Function)) callback(1);
        }
    })
};