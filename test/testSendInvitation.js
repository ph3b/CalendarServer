/**
 * Created by mattiden on 14.03.15.
 */
require('./../server.js')('test');
var io = require('socket.io-client');
var db = require('./../config/db.js');
var settings = require('./../config/settings.js');
var expect = require('expect.js');
var jwt = require('jsonwebtoken');


var appointment = {
    "title": "Sprintmøte",
    "description" : "Her skal vi svare!",
    "date": "21.2.2015",
    "start_time": "10:50",
    "end_time": "15:00",
    "owned_by_user": 1
};

var mathias = {"username": "mathias", "user_id" : 1};
var erlend = {"username": "erlend", "user_id" : 2};

var mathiasOptions = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(mathias, settings.secret)
};
var erlendOptions = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(erlend, settings.secret)
};
var existingAppointmentId;
var apiUrl = 'http://localhost:3000';

describe('User invites user to existing appointment', function(){
    before(function(done){
        db.query("insert into cal_appointment set ?", appointment, function(err, res){
            if(!err){
                existingAppointmentId = res.insertId;
                done();
            }
        })
    });
    after(function(done){
       db.query("delete from cal_appointment", function(err,res){
           if(!err){
               done();
           }
       })
    });
    it('Second user should get an invitation', function(done){
        var mathiasIo = io.connect(apiUrl, mathiasOptions);
        var erlendIo = io.connect(apiUrl, erlendOptions);

        var eRes;
        var mRes;
        var cbCounter = 0;

        var evalTest = function(){
            expect(eRes).to.be.eql(mRes);
            expect(eRes.participants[0].user_id).to.be.eql(2);
            expect(eRes.participants[0].invite_accepted).to.be.eql(0);
            erlendIo.disconnect();
            mathiasIo.disconnect();
            done();
        };
        mathiasIo.on('connect', function(){
            erlendIo.on('connect', function(){
                var invitationMessage = {"user_id": 2, "appointment_id": existingAppointmentId};
                mathiasIo.emit('invitation:send', invitationMessage);
                erlendIo.on("appointment:get", function(eApp){
                    eRes = eApp;
                    cbCounter++;
                    if(cbCounter == 2){
                        evalTest();
                    }
                });
                mathiasIo.on("appointment:get", function(mApp){
                    mRes = mApp;
                    cbCounter++;
                    if(cbCounter == 2){
                        evalTest();
                    }
                })
            })
        })
    })

});