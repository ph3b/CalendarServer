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
            "title": "Second appointment",
            "date": "21.2.2015",
            "start_time": "10:50",
            "participants" : participants
        };
        client.emit("appointment:new", appointment, function(res){
            db.query('select * from cal_userInvitedToAppointment where user_id = ?', 2, function(err, user_2){
                db.query('select * from cal_userInvitedToAppointment where user_id = ?', 2, function(err, user_552){
                    db.query('select * from cal_userInvitedToAppointment where user_id = ?', 2, function(err, user_553){
                        expect(res.message).to.be.eql('added');
                        expect(user_2.length).to.be.eql(1);
                        expect(user_552.length).to.be.eql(1);
                        expect(user_553.length).to.be.eql(1);
                        client.disconnect();
                        done();
                    })
                })
            })
        })
    });

    it('Should add new appointment to database and invite proper users', function(done){
        this.timeout(10000);
        var client = io.connect(apiUrl, optionsMathias);
        var participants = [
            '2',
            '552',
            '553'
        ];
        var appointment = {
            "title": "Second appointment",
            "date": "21.2.2015",
            "start_time": "10:50",
            "participants" : participants
        };
        client.on('connect', function(){
            console.log("Koblet til ny socket");
            client.emit('appointment:new', appointment, function(res){
                console.log("Kom hit: " + res.message);
            });
            client.on('appointment:get', function(app){
                console.log(app)
                expect(app.appointment_id).to.be.a("number");
                client.disconnect();
                done();
            });
        })

    });


});