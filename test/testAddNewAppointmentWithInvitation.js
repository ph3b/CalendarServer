/* Created by mattiden on 28.02.15.
 */
require('./../server.js')('test');
var expect = require('expect.js');
var io = require('socket.io-client');
var db = require('./../config/db.js');
var settings = require('./../config/settings.js');
var jwt = require('jsonwebtoken');

var apiUrl = 'http://localhost:3000';

var mathias = {"username" : "mathias", "user_id" : 1};
var erlend = {"username" : "erlend", "user_id" : 2};
var bessen = {"username" : "bessen", "user_id" : 3};

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

var optionsBessen = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(bessen, settings.secret)
};

describe('User creates new appointment with preselected participants', function(){
    this.timeout(10000);
    before(function(done){
        db.query('delete from cal_appointment', function(){
            done();
        });
    });
    after(function(done){
        db.query('delete from cal_appointment', function(){
            done();
        });
    });
    it('Should send serialized version of new appointment to all preselected participants if they are online', function(done){
        var participants = ['2','3'];
        this.timeout(5000);

        var mathiasIo = io.connect(apiUrl, optionsMathias);
        var erlendIo = io.connect(apiUrl, optionsErlend);
        var bessenIo = io.connect(apiUrl, optionsBessen);

        var appointment = {
            "title": "Hyttetur",
            "description" : "Nå blir det fisking",
            "date": "21.2.2015",
            "start_time": "10:50",
            "end_time": "15:00",
            "participants" : participants
        };
        mathiasIo.on('connect', function(){
            erlendIo.on('connect', function(){
                bessenIo.on('connect', function(){
                    mathiasIo.emit("appointment:new", appointment);
                    erlendIo.on('appointment:get', function(eAppointment){
                        erlendIo.disconnect();
                        mathiasIo.disconnect();
                        bessenIo.disconnect();
                        done();
                    })
                })
            })
        })

    });
    it('should give callback when new appointed added and invitations sent',function(done){
        var mathiasIo = io.connect(apiUrl, optionsMathias);

        mathiasIo.on('connect', function(){
            var participants = ['2','3'];
            var appointment = {
                "title": "Hyttetur",
                "description" : "Nå blir det fisking",
                "date": "21.2.2015",
                "start_time": "10:50",
                "end_time": "15:00",
                "participants" : participants
            };
            mathiasIo.emit("appointment:new", appointment, function(callback){
                expect(callback.message).to.be.eql('added');
                expect(callback.status).to.be.eql(200);
                mathiasIo.disconnect();
                done();
            })
        })
    });
    it('should send back serialized version of added appointment',function(done){
        var mathiasIo = io.connect(apiUrl, optionsMathias);

        mathiasIo.on('connect', function(){
            var participants = ['2','3'];
            var appointment = {
                "title": "Hyttetur",
                "description" : "Nå blir det fisking",
                "date": "21.2.2015",
                "start_time": "10:50",
                "end_time": "15:00",
                "participants" : participants
            };
            mathiasIo.emit("appointment:new", appointment);
            mathiasIo.on('appointment:get', function(app){
                expect(app.owned_by_user).to.be.eql(1);
                expect(app.participants.length).to.be.eql(2);
                mathiasIo.disconnect();
                done();
            })
        })
    })
});
