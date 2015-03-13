/**
 * Created by mattiden on 03.03.15.
 */
var db = require('./../../config/db.js');
var settings = require('./../../config/settings.js');
var jwt = require('jsonwebtoken');
var getInitialAppointments = require('./db_handlers/dbGetAppointmentForUserId');
var getInitialUserList = require('./db_handlers/dbGetUsers');

module.exports = function(socket){
    var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;
    var thisUser;

    getInitialAppointments(user_id, function(apps){
        getInitialUserList(function(users){
            // Adds the logged in user in first position
            for(var i = 0; i<users.length;i++){
                if(users[i].user_id === user_id){
                    thisUser = JSON.parse(JSON.stringify(users[i]));
                    users.splice(i, 1);
                    break;
                }
            }
            users.push(thisUser);
            users = users.reverse();

            socket.emit('appointment:initialreceive', apps);
            socket.emit('users:initialreceive', users);
        })
    });
};