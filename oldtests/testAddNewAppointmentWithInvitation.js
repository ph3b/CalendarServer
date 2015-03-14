/**
 * Created by mattiden on 02.03.15.
 */
/**
 * Created by mattiden on 28.02.15.
 */
require('../server.js')('test');
var expect = require('expect.js');
var io = require('socket.io-client');
var db = require('./../config/db.js');
var settings = require('./../config/settings.js');

var apiUrl = 'http://localhost:3000';

var mathias = {"username" : "mathias", "user_id" : 1};
var erlend = {"username" : "erlend", "user_id" : 2};


var optionsErlend = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(erlend, settings.secret)
};
var optionsMathias = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(mathias, settings.secret)
};

describe('New Appointment with invitation', function(){
    db.query('delete from cal_appointment');

    it('Should add new appointment to database and invite proper users', function(done){
        this.timeout(10000);
        var client = io.connect(apiUrl, optionsMathias);
        var participants = [
            '2',
            '552',
            '553'
        ];
        var appointment = {
            "title": "Hyttetur",
            "description" : "Nå blir det fisking",
            "date": "21.2.2015",
            "start_time": "10:50",
            "end_time": "15:00",
            "participants" : participants
        };
        client.emit("appointment:new", appointment, function(res){
            client.disconnect();
            done();
        })
    });

    it('Should add new appointment to database and invite proper users(2)', function(done){
        this.timeout(10000);
        var client = io.connect(apiUrl, optionsErlend);
        var participants = [
            '1'
        ];
        var appointment = {
            "title": "Hyttetur",
            "description" : "Ladetur",
            "date": "21.2.2015",
            "start_time": "10:50",
            "end_time": "15:00",
            "participants" : participants
        };
        client.emit("appointment:new", appointment, function(res){
            client.disconnect();
            done();
        })
    });

    it('Should send new appointment to user', function(done){
        this.timeout(10000);
        var client = io.connect(apiUrl, optionsMathias);
        var participants = [
            '2',
            '552',
            '553'
        ];
        var appointment = {
            "title": "Vaske bilden",
            "description": "den er shitten",
            "date": "21.2.2015",
            "start_time": "10:50",
            "end_time": "15:00",
            "participants" : participants
        };
        client.on('connect', function(){
            console.log("Koblet til ny socket");
            client.emit('appointment:new', appointment, function(res){
            });
            client.on('appointment:get', function(app){
                expect(app.appointment_id).to.be.a("number");
                client.disconnect();
                done();
            });
        })

    });
});