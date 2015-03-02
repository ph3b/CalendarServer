/**
 * Created by mattiden on 02.03.15.
 */
/**
 * Created by mattiden on 02.03.15.
 */
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../config/settings.js');
var db = require('./../../config/db.js');

var users = [
    {"username": "mathias", "password": "tennis"},
    {"username": "erlend", "password": "fotball"}
];

module.exports = function(socket){
    socket.on('appointment:new', function(req, res){
        var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;
        var appointment = {
            "title": req.title,
            "start_date": req.start_date,
            "created_date": req.end_date,
            "owned_by_user": user_id
        };
        db.query("insert into cal_appointment set ?", appointment, function(err, results, fields){
            if(!err && typeof res == 'function'){
                res({"message" : 'added', "status" : 200});
                return;
            }
            if(err){
                res.status(500);
                res.send(err);
            }
        })
    })
};