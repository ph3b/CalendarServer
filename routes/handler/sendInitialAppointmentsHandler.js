/**
 * Created by mattiden on 03.03.15.
 */
var db = require('./../../config/db.js');
var settings = require('./../../config/settings.js');
var jwt = require('jsonwebtoken');

module.exports = function(socket){
    var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;
    db.query("select * from cal_appointment where owned_by_user= ?", user_id, function(err, results){
        if(err){
            socket.emit("appointment:initialreceive", err);
            console.log('Came here');
        }
        socket.emit('appointment:initialreceive', results);
        console.log('success!');
    })
};