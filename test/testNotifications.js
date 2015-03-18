/**
 * Created by mattiden on 15.03.15.
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
var participants = ['2','3'];
var appointment = {
    "title": "Hyttetur",
    "description" : "Nå blir det fisking",
    "date": "21.2.2015",
    "start_time": "10:50",
    "end_time": "15:00",
    "participants" : participants
};
var exisitingApp;

describe('Notifications when inviting users to appointment', function(){
    this.timeout(10000);
    before(function(done){
        var app2 = JSON.parse(JSON.stringify(appointment));
        delete app2.participants;
        db.query('delete from cal_appointment', function(){
            db.query('insert into cal_appointment set ?', app2, function(err, res){
                if(err){
                    console.log(err);
                }
                exisitingApp = res.insertId;
                done();
            });
        });
    });
    after(function(done){
        db.query('delete from cal_appointment', function(){
            done();
        });
    });
    it('Should send notification to all participants invited when creating new appointment', function(done){
        this.timeout(5000);

        var erlendRes;
        var bessenRes;
        var cbCounter = 0;
        var evalTest = function(){
            expect(erlendRes).to.be.eql(bessenRes);
            expect(erlendRes.title).to.be.eql("Hyttetur");
            expect(erlendRes.date).to.be.eql("21.2.2015");
            mathiasIo.disconnect();
            erlendIo.disconnect();
            bessenIo.disconnect();
            done();
        };

        var mathiasIo = io.connect(apiUrl, optionsMathias);
        var erlendIo = io.connect(apiUrl, optionsErlend);
        var bessenIo = io.connect(apiUrl, optionsBessen);

        mathiasIo.on('connect', function(){
            erlendIo.on('connect', function(){
                bessenIo.on('connect', function(){
                    mathiasIo.emit("appointment:new", appointment);
                    erlendIo.on('invite:new', function(erlendNotification){
                        erlendRes = erlendNotification;
                        cbCounter++;
                        if(cbCounter == 2){
                            evalTest();
                        }
                    });
                    erlendIo.on('invite:new', function(bessenNotification){
                        bessenRes = bessenNotification;
                        cbCounter++;
                        if(cbCounter == 2){
                            evalTest();
                        }
                    })
                })
            })
        })

    });
    it('Should send notification to user after inviting him to existing appointment',function(done){
        var inviteMessage = {
            "user_id": 2,
            "appointment_id": exisitingApp
        };
        var mathiasIo = io.connect(apiUrl, optionsMathias);
        var erlendIo = io.connect(apiUrl, optionsErlend);

        mathiasIo.on('connect', function(){
            erlendIo.on('connect', function(){
                mathiasIo.emit("invitation:send", inviteMessage);
                erlendIo.on('invite:new', function(notification){
                    expect(notification.title).to.be.eql('Hyttetur');
                    expect(notification.date).to.be.eql('21.2.2015');
                    erlendIo.disconnect();
                    mathiasIo.disconnect();
                    done();
                })
            })
        })
    })
});