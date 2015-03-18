/**
 * Created by mattiden on 13.03.15.
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

var apiUrl = 'http://localhost:3000';

var mathias = {"username": "mathias", "user_id" : 1};
var erlend = {"username": "erlend", "user_id" : 2};
var bessen = {"username": "bessen", "user_id" : 3};

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
var bessenOptions = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(bessen, settings.secret)
};

var existingAppointmentId;

describe("User answers invitation", function(){
    this.timeout(10000);
    before(function(done){
        db.query("insert into cal_appointment set ?", appointment, function(err, res){
            existingAppointmentId = res.insertId;
            db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [2, existingAppointmentId], function(err1, res1){
                db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [3, existingAppointmentId], function(err2, res2){
                    done();
                })
            })
        })
    });
    after(function(done){
        db.query("delete from cal_appointment", function(){
            done();
        })
    });
    it('Should give callback when answering invitation',function(done){
        var acceptMessage = {"appointment_id": existingAppointmentId, "invite_accepted": 1};
        var erlendIo = io.connect(apiUrl, erlendOptions);

        erlendIo.on('connect', function() {
            erlendIo.emit("invitation:reply", acceptMessage, function(res) {
                expect(res.message).to.be.eql('ok');
                expect(res.status).to.be.eql(200);
                erlendIo.disconnect();
                done();
            })
        })
    });
    it('Should update everyone when someone answers invitation',function(done){
        var callbackCounter = 0;
        var acceptMessage = {"appointment_id": existingAppointmentId, "invite_accepted": 1};
        var mathiasIo = io.connect(apiUrl, mathiasOptions);
        var erlendIo = io.connect(apiUrl, erlendOptions);
        var bessenIo = io.connect(apiUrl, bessenOptions);
        var besReply;
        var erlReply;
        var mattReply;
        var evaluateTest = function(){
            expect(mattReply).to.be.eql(erlReply);
            expect(erlReply).to.be.eql(besReply);
            expect(besReply.participants[0].invite_accepted).to.be.eql(1);
            expect(besReply.participants[1].invite_accepted).to.be.eql(1);
            done();
            bessenIo.disconnect();
            erlendIo.disconnect();
            mathiasIo.disconnect();
        };
        mathiasIo.on('connect', function(){
            erlendIo.on('connect', function(){
                bessenIo.on('connect', function(){
                    bessenIo.emit('invitation:reply', acceptMessage);
                    bessenIo.on('appointment:get', function(besres){
                        besReply = besres;
                        callbackCounter++;
                        if(callbackCounter == 3){
                            evaluateTest();
                        }
                    });
                    mathiasIo.on('appointment:get', function(matres){
                        mattReply = matres;
                        callbackCounter++;
                        if(callbackCounter == 3){
                            evaluateTest();
                        }
                    });
                    erlendIo.on('appointment:get', function(erlres){
                        erlReply = erlres;
                        callbackCounter++;
                        if(callbackCounter == 3){
                            evaluateTest();
                        }
                    })
                })
            })
        })


    })
});
