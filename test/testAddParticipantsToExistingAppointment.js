/**
 * Created by mattiden on 17.03.15.
 */
/**
 * Created by mattiden on 13.03.15.
 */
/**
 * Created by mattiden on 12.03.15.
 */
require('./../server.js')('test');
var io = require('socket.io-client');
var db = require('./../config/db.js');
var settings = require('./../config/settings.js');
var expect = require('expect.js');
var jwt = require('jsonwebtoken');


var appointment = {
    "title": "Sprintmøte",
    "description" : "Møte med teameet!",
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

describe("Update appointment with new participantlist", function(){
    before(function(done){
        db.query("insert into cal_appointment set ?", appointment, function(err, res){
            existingAppointmentId = res.insertId;
            db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [2, existingAppointmentId], function(err1, res1){
                db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [3, existingAppointmentId], function(err2, res2){
                    db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [552, existingAppointmentId], function(err2, res3){
                        done();
                    })
                })
            })
        })
    });
    after(function(done){
        db.query("delete from cal_appointment", function(){
            done();
        })
    });
    it('should change participantlist and notify owner', function(done){
        appointment = {
            "appointment_id" : existingAppointmentId,
            "title": "Sprintmøte redigert",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "12:50",
            "end_time": "14:00",
            "owned_by_user": 1,
            "participants" : ['2', '3']
        };
        var mathiasIo = io.connect(apiUrl, mathiasOptions);
        mathiasIo.on('connect', function(){
            mathiasIo.emit('appointment:update', appointment);
            mathiasIo.on('appointment:get', function(editedApp){
                var counter = 0;
                editedApp.participants.forEach(function(part){
                    if(part.user_id == 552){
                        counter = 1;
                    }
                });
                expect(editedApp.participants.length).to.be(2);
                expect(counter).to.be(0);
                mathiasIo.disconnect();
                done();
            })

        })
    });
    it('should add new person to participant list and notify owner', function(done){
        appointment = {
            "appointment_id" : existingAppointmentId,
            "title": "Sprintmøte redigert",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "12:50",
            "end_time": "14:00",
            "owned_by_user": 1,
            "participants" : ['2', '3', '552']
        };
        var mathiasIo = io.connect(apiUrl, mathiasOptions);
        mathiasIo.on('connect', function(){
            mathiasIo.emit('appointment:update', appointment);
            mathiasIo.on('appointment:get', function(editedApp){
                var counter = 0;
                editedApp.participants.forEach(function(part){
                    if(part.user_id == 552){
                        counter = 1;
                    }
                });
                expect(editedApp.participants.length).to.be(3);
                expect(counter).to.be(1);
                mathiasIo.disconnect();
                done();
            })

        })
    });
    it('should add and remove users in participant list and notify owner', function(done){
        this.timeout(5000);
        appointment = {
            "appointment_id" : existingAppointmentId,
            "title": "Sprintmøte redigert",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "12:50",
            "end_time": "14:00",
            "owned_by_user": 1,
            "participants" : ['2', '3', '553']
        };
        var mathiasIo = io.connect(apiUrl, mathiasOptions);
        mathiasIo.on('connect', function(){
            mathiasIo.emit('appointment:update', appointment);
            mathiasIo.on('appointment:get', function(editedApp){
                var counter1 = 0;
                var counter2 = 0;
                editedApp.participants.forEach(function(part){
                    if(part.user_id == 552){
                        counter1 = 1;
                    }
                });
                editedApp.participants.forEach(function(part){
                    if(part.user_id == 553){
                        counter2 = 1;
                    }
                });
                expect(editedApp.participants.length).to.be(3);
                expect(counter1).to.be(0);
                expect(counter2).to.be(1);
                mathiasIo.disconnect();
                done();
            })

        })
    });


    it('should changed participant list to new participant list and notify send uppate to all members', function(done){
        this.timeout(5000);
        appointment = {
            "appointment_id" : existingAppointmentId,
            "title": "Sprintmøte redigert",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "12:50",
            "end_time": "14:00",
            "owned_by_user": 1,
            "participants" : ["2"]
        };
        var mRes;
        var eRes;
        var bRes;
        var cbCounter = 0;
        var evaluateTest = function(){
            expect(mRes).to.be.eql(eRes);
            expect(mRes.participants.length).to.be.eql(1);
            expect(bRes).to.be.eql(existingAppointmentId);
            mathiasIo.disconnect();
            erlendIo.disconnect();
            bessenIo.disconnect();
            done();
        };
        var mathiasIo = io.connect(apiUrl, mathiasOptions);
        var erlendIo = io.connect(apiUrl, erlendOptions);
        var bessenIo = io.connect(apiUrl, bessenOptions);

        mathiasIo.on('connect', function(){
            erlendIo.on('connect', function(){
                bessenIo.on("connect", function(){
                    mathiasIo.emit('appointment:update', appointment);
                    erlendIo.on('appointment:get', function(erlendApp){
                        eRes = erlendApp;
                        cbCounter++;
                        if(cbCounter == 3) evaluateTest();
                    });
                    bessenIo.on('appointment:delete', function(bessenApp){
                        bRes = bessenApp;
                        cbCounter++;
                        if(cbCounter == 3) evaluateTest();

                    });
                    mathiasIo.on('appointment:get', function(mathiasApp){
                        mRes = mathiasApp;
                        cbCounter++;
                        if(cbCounter == 3) evaluateTest();
                    })
                })
            })


        })
    });

});
