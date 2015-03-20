/**
 * Created by mattiden on 03.03.15.
 */
var db = require('./../../config/db.js');
var settings = require('./../../config/settings.js');
var jwt = require('jsonwebtoken');
var getInitialAppointments = require('./db_handlers/dbGetAppointmentsForUserId');
var getInitialUserList = require('./db_handlers/dbGetUsers');

module.exports = function(socket){
    var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;
    var current_user = {"user_id" : user_id};
    var currentUser;
    getInitialAppointments(user_id, function(apps){
        getInitialUserList(function(users){
            // Removes currently logged in user
            for(var i = 0; i<users.length;i++){
                if(users[i].user_id === user_id){
                    currentUser = JSON.parse(JSON.stringify(users[i])); // Deep copy
                    users.splice(i, 1);
                    break;
                }
            }
            socket.emit('user:current', current_user);
            socket.emit('appointment:initialreceive', apps);
            socket.emit('users:initialreceive', users);
        })
    });
};