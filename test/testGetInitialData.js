/**
 * Created by mattiden on 13.03.15.
 */
require('./../server.js')('test');
var expect = require('expect.js');
var io = require('socket.io-client');
var db = require('./../config/db.js');
var settings = require('./../config/settings.js');
var jwt = require('jsonwebtoken');

var apiUrl = 'http://localhost:3000';

var credentials = {"username": "mathias", "user_id" : 1};
var credentials2 = {"username": "Erlend Stenberg", "user_id" : 2};

var clientOptions = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(credentials, settings.secret)
};
var clientOptions2 = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(credentials2, settings.secret)
};

describe('Initial loads', function(){

    before(function(done){
        db.query('delete from cal_appointment', function(err, res){
            if(err){
            }
            var appointment1 = {
                "title": "Appointment 1",
                "description" : "Møte med teameet!",
                "date": "15.2.2015",
                "start_time": "10:50",
                "end_time": "15:00",
                "owned_by_user" : 1
            };
            var appointment2 = {
                "title": "Appointment 2",
                "description" : "Møte med teameet!",
                "date": "21.2.2015",
                "start_time": "10:50",
                "end_time": "15:00",
                "owned_by_user" : 1
            };

            var query = "insert into cal_appointment set ?";

            db.query(query, appointment1, function(err1, res){
                db.query(query, appointment2, function(err2, res){
                    done();
                })
            });
        });
    });

    after(function(done){
        db.query('delete from cal_appointment', function(){
            done();
        })
    });

    it('Should receive relevant appointments from server',function(done){
        var client = io.connect(apiUrl,clientOptions);
        client.on('connect', function(){
            client.on('appointment:initialreceive', function(appointments){
                expect(appointments).to.be.an('array');
                expect(appointments.length).to.be(2);
                expect(appointments[0].participants).to.be.an('array');
                client.disconnect();
                done();
            })
        })
    });
    it('Should receive user list from server. Current user should not be included',function(done){
        var client = io.connect(apiUrl,clientOptions);
        client.on('connect', function(){
            client.on('users:initialreceive', function(users){
                var foundCurrentUser = false;
                expect(users).to.be.an('array');
                expect(users[0]).to.have.property('user_id');
                expect(users[0]).to.have.property('fullname');
                users.forEach(function(user){
                        if(user.user_id == 1){
                            foundCurrentUser = true;
                        }
                });
                expect(foundCurrentUser).to.be(false);
                client.disconnect();
                done();
            })
        })
    });
    it('Should get current user',function(done){
        var client = io.connect(apiUrl,clientOptions2);
        client.on('connect', function(){
            client.on('user:current', function(user){
                expect(user.user_id).to.be(2);
                client.disconnect();
                done();
            })
        })
    })
});