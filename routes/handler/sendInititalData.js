/**
 * Created by mattiden on 03.03.15.
 */
var db = require('./../../config/db.js');
var settings = require('./../../config/settings.js');
var jwt = require('jsonwebtoken');
var getInitialAppointments = require('./db_handlers/getAppointmentsForCurrentUser');
var getInitialUserList = require('./db_handlers/getUsers');

module.exports = function(socket){
    var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;

    getInitialAppointments(user_id, function(appointments){
        getInitialUserList(function(users){
            socket.emit('appointment:initialreceive', appointments);
            socket.emit('users:initialreceive', users);
        })
    });
};