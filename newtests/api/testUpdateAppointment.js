/**
 * Created by mattiden on 13.03.15.
 */
/**
 * Created by mattiden on 12.03.15.
 */
require('./../../server.js')('test');
var io = require('socket.io-client');
var db = require('./../../config/db.js');
var settings = require('./../../config/settings.js');
var expect = require('expect.js');

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

describe("Update appointments", function(){
    before(function(done){
        db.query("insert into cal_appointment set ?", appointment, function(err, res){
            existingAppointmentId = res.insertId;
            db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [2, existingAppointmentId], function(err1, res1){
                db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [3, existingAppointmentId], function(err2, res2){
                    console.log(err, err1, err2);
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
    it('Should update existing appointment and get it back serialized',function(done){
        appointment = {
            "appointment_id" : existingAppointmentId,
            "title": "Sprintmøte redigert",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "12:50",
            "end_time": "14:00",
            "owned_by_user": 1
        };
        var client = io.connect(apiUrl, mathiasOptions);
        client.on('connect', function(){
            client.emit('appointment:update', appointment);
            client.on('appointment:get', function(changedApp){
                expect(changedApp.appointment_id).to.be.eql(existingAppointmentId);
                expect(changedApp.title).to.be.eql("Sprintmøte redigert");
                expect(changedApp.start_time).to.be.eql("12:50");
                expect(changedApp.end_time).to.be.eql("14:00");
                client.disconnect();
                done();
            })
        });
    });
    it('Should get callback when successfully updating appointment',function(done){
        appointment = {
            "appointment_id" : existingAppointmentId,
            "title": "Sprintmøte redigert",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "12:50",
            "end_time": "14:00",
            "owned_by_user": 1
        };
        var client = io.connect(apiUrl, mathiasOptions);
        client.on('connect', function(){
            client.emit('appointment:update', appointment, function(response){
                expect(response.message).to.be.eql("added");
                expect(response.status).to.be.eql(200);
                client.disconnect();
                done();
            });
        });
    });
    it('Should send updated serialized appointment to all invited users',function(done){
        appointment = {
            "appointment_id" : existingAppointmentId,
            "title": "Sprintmøte redigert",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "12:50",
            "end_time": "14:00",
            "owned_by_user": 1
        };
        var mathias = io.connect(apiUrl, mathiasOptions);
        var erlend = io.connect(apiUrl, erlendOptions);
        var bessen = io.connect(apiUrl, bessenOptions);
        mathias.on('connect', function(){
            erlend.on('connect', function(){
                bessen.on('connect', function(){
                    mathias.emit('appointment:update', appointment);
                    erlend.on('appointment:get', function(eApp){
                        bessen.on('appointment:get', function(bApp){
                            mathias.disconnect();
                            erlend.disconnect();
                            bessen.disconnect();
                            expect(eApp).to.be.eql(bApp);
                            expect(eApp.appointment_id).to.be.eql(existingAppointmentId);
                            expect(eApp.title).to.be.eql("Sprintmøte redigert");
                            expect(eApp.start_time).to.be.eql("12:50");
                            expect(eApp.end_time).to.be.eql("14:00");
                            done();
                        })
                    })
                })
            })
        });
    })
});
