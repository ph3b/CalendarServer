/**
 * Created by mattiden on 12.03.15.
 */
jwt = require('jsonwebtoken');
var _ = require('lodash');
var settings = require('../../../config/settings.js');
var db = require('./../../../config/db.js');
var inviteUsersToAppointment = require('./sendInvitationTo');

module.exports = function(appointment, req, socket, callback){
    db.beginTransaction(function(_err){
        db.query("insert into cal_appointment set ?", appointment, function(err, results){
            if(err){
                if(typeof callback === typeof(Function)){
                    var message = { "status": 500, "message": "Something went wrong"};
                    callback(message);
                    return;
                }
            } else {
                // Case 1: Det finnes en liste over id'er som skal inviteres
                if(req.participants && req.participants.length){
                    inviteUsersToAppointment(req.participants, results.insertId, function(cb){
                        /* istanbul ignore if */
                        if(cb === 0){
                            db.rollback(function(rb_err){
                                var message = { "status": 500, "message": "Something went wrong"};
                                if(typeof callback === typeof(Function)){
                                    callback(message);
                                    return;
                                }
                            })
                        } else {
                            db.commit(function(err) {
                                if(!err){
                                    db.query('select * from cal_appointment where appointment_id = ?', results.insertId, function(err, res){
                                        if(!err) {
                                            socket.emit("appointment:get", res[0]);
                                            if(typeof(callback) === typeof(Function)){
                                                callback({"message": 'added', "status": 200});
                                                return;
                                            }
                                        }
                                    });
                                }
                                if (err) {
                                    db.rollback(function() {
                                        var message = { "status": 500, "message": "Db error"};
                                        if(typeof callback === typeof(Function)){
                                            callback(message);
                                            return;
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
                                console.log("Kom hvor du skulle");
                                socket.emit("appointment:get", res[0]);
                                var message = {"message" : 'added', "status" : 200};
                                if(typeof callback === typeof(Function)){
                                    callback(message);
                                    return;
                                }
                            });
                        }
                        /* istanbul ignore if */
                        if (err) {
                            db.rollback(function() {
                                console.log(err);
                                var message = { "status": 500, "message": "Error users"};
                                if(typeof callback === typeof(Function)){
                                    callback(message);
                                    return;
                                }
                                throw err;
                            });
                        }
                    });
                }
            }
        })
    });
};