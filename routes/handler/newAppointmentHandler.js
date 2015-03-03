jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../config/settings.js');
var db = require('./../../config/db.js');

module.exports = function(socket){
    socket.on('appointment:new', function(req, res){
        var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;
        var appointment = {
            "title": req.title,
            "date": req.date,
            "time": req.time,
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