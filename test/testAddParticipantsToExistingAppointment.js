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

describe("Update appointments", function(){
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
    it('Should update existing appointment and get it back serialized',function(done){
        var participants = [2];
        appointment = {
            "appointment_id" : existingAppointmentId,
            "title": "Sprintmøte redigert",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "12:50",
            "end_time": "14:00",
            "owned_by_user": 1,
            "participants" : participants
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


});
