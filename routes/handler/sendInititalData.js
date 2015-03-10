/**
 * Created by mattiden on 03.03.15.
 */
var db = require('./../../config/db.js');
var settings = require('./../../config/settings.js');
var jwt = require('jsonwebtoken');


module.exports = function(socket){
    var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;

    var query = "select cal_appointment.appointment_id, title, date, owned_by_user, description, start_time, end_time from cal_appointment";
    query += " join cal_userInvitedToAppointment";
    query += " on(cal_appointment.appointment_id = cal_userInvitedToAppointment.appointment_id)";
    query += " where owned_by_user = ? or user_id = ?";
    query += " group by cal_appointment.appointment_id";

    db.query(query, [user_id, user_id], function(err, results){
        /* istanbul ignore if */
        if(err){
            socket.emit("appointment:initialreceive", err);
            return;
        }


        socket.emit('appointment:initialreceive', results);
        var users = [];
        var user1 = {"user_id": 1, "fullname": "Mathias Iden"};
        var user2 = {"user_id": 2, "fullname": "Erlend Stenberg"};
        users.push(user1);
        users.push(user2);
        socket.emit('users:initialreceive', users);


    })
};