/**
 * Created by mattiden on 18.03.15.
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

describe('Should send notifications to added users', function(){

    this.timeout(5000);
    before(function(done){
        db.query("insert into cal_appointment set ?", appointment, function(err, res){
            existingAppointmentId = res.insertId;
                db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [3, existingAppointmentId], function(err2, res2){
                        done();
                    if(err2 || err) console.log(err2, err);
                })
        })
    });
    it('It should send notification to added user', function(done){
        var editedApp = {
            "appointment_id" : existingAppointmentId,
            "title": "Sprintmøte redigert",
            "description" : "Møte med teameet! - Redigert",
            "date": "21.2.2015",
            "start_time": "10:50",
            "end_time": "15:00",
            "owned_by_user": 1,
            "participants" : ['3', '2']
        };
        var mathiasIo = io.connect(apiUrl, mathiasOptions);
        var erlendIo = io.connect(apiUrl, erlendOptions);
        mathiasIo.on('connect', function(){
            erlendIo.on('connect', function(){
                mathiasIo.emit('appointment:update', editedApp);
                erlendIo.on('invite:new', function(invite){
                    console.log(invite);
                    expect(invite.title).to.be.eql('Sprintmøte redigert');
                    expect(invite.date).to.be.eql('21.2.2015');
                    mathiasIo.disconnect();
                    erlendIo.disconnect();
                    done();
                })

            })
        });
    })
});