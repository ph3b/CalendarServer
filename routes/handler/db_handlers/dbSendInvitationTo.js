/**
 * Created by mattiden on 07.03.15.
 */
var db = require('./../../../config/db');

//
// Skal sende invitasjoner til mange brukere samtidig
//

module.exports = function(listOfUsersToInvite, appointment_id, callback){
        var query = "insert into cal_userInvitedToAppointment(user_id, appointment_id) values";

        var generateSqlQuery = function(user_id, appointment_id){
            return (" (" + user_id + "," + appointment_id + ")")
        };
        for(var i = 0; i<listOfUsersToInvite.length; i++){
            if(i === listOfUsersToInvite.length-1){
                query += generateSqlQuery(listOfUsersToInvite[i], appointment_id)
            } else {
                query += generateSqlQuery(listOfUsersToInvite[i], appointment_id) + ','
            }
        }
        db.query(query, function(err, res){
            if(err){
                callback(0);
            } else {
                callback();
            }

        })
    };