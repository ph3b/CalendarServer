/**
 * Created by mattiden on 12.03.15.
 */
jwt = require('jsonwebtoken');
var settings = require('../../../config/settings.js');
var db = require('./../../../config/db.js');
var inviteUsersToAppointment = require('./dbSendInvitationTo');

module.exports = function(appointment, callback){
    var tempAppointment = JSON.parse(JSON.stringify(appointment)); //Deep copy hack
    delete tempAppointment.participants;

    db.beginTransaction(function(_err){
        db.query("insert into cal_appointment set ?", tempAppointment, function(err, results){
            if(err){
                if(typeof callback === typeof(Function)){
                    var message = { "status": 500, "message": "Something went wrong"};
                    callback(message);
                }
            }
            // Case 1: Det finnes en liste over id'er som skal inviteres
            if(appointment.participants !== undefined){
                inviteUsersToAppointment(appointment.participants, results.insertId, function(cb){
                    /* istanbul ignore if */
                    if(cb === 0){
                        db.rollback(function(rb_err){
                            var message = { "status": 500, "message": "Something went wrong"};
                            /* istanbul ignore if */
                            if(typeof callback === typeof(Function)){
                                callback(message);
                            }
                        })
                    } else {
                        db.commit(function(err) {
                            if(!err){
                                db.query('select * from cal_appointment where appointment_id = ?', results.insertId, function(err, res){
                                    if(!err) {
                                        var message = { "status": 200, "message": "added"};
                                        if(typeof(callback) === typeof(Function)) callback(message, res[0]);
                                    }
                                });
                            }
                            if (err) {
                                db.rollback(function() {
                                    var message = { "status": 500, "message": "Db error"};
                                    /* istanbul ignore if */
                                    if(typeof callback === typeof(Function)){
                                        callback(message);
                                    }
                                });
                            }
                        });
                    }
                })
            }
            else {
                // Case 2: Det finnes ikke en liste over id'er som skal inviteres
                db.commit(function(err) {
                    if(!err){
                        db.query('select * from cal_appointment where appointment_id = ?', results.insertId, function(err, res){
                            if(!err){
                                var message = { "status": 200, "message": "added"};
                                if(typeof(callback) === typeof(Function)) callback(message, res[0]);
                            }
                        });
                    }
                    if (err) {
                        db.rollback(function() {
                            console.log(err);
                            var message = { "status": 500, "message": "Error users"};
                            /* istanbul ignore if */
                            if(typeof callback === typeof(Function)){
                                callback(message);
                                return;
                            }
                            throw err;
                        });
                    }
                });
            }

    })
});
};