/**
 * Created by mattiden on 02.03.15.
 */
/**
 * Created by mattiden on 28.02.15.
 */
require('../server.js')('test');
var expect = require('expect.js');
var send = require('superagent');
var io = require('socket.io-client');
var db = require('./../config/db.js');


var apiUrl = 'http://localhost:3000';

describe('New Appointment', function(){

    it('Should add new appointment to database if logged in',function(done){
        this.timeout(10000);
        var credentials = {"username": "mathias", "password": "hawaii"};
        send.post(apiUrl + '/login')
            .send(credentials)
            .end(function(err, res){
                var token = res.body.token;
                var options = {
                    transports: ['websocket'],
                    'force new connection': true,
                    'query': 'token=' + token
                };
                var client = io.connect(apiUrl, options);
                var appointment = {
                    "title": "First appointment evar",
                    "date": "21.2.2015",
                    "time": "10:50"
                };
                client.on('connect' , function(){
                    client.emit('appointment:new', appointment, function(res){
                        expect(res.message).to.be('added');
                        expect(res.status).to.be(200);
                        client.disconnect();
                        done();
                    });
                })
            })
    });

    it('Should not add new appointment to database if payload is invalid',function(done){
        this.timeout(10000);
        var credentials = {"username": "mathias", "password": "hawaii"};

        send.post(apiUrl + '/login')
            .send(credentials)
            .end(function(err, res){
                var token = res.body.token;

                var options = {
                    transports: ['websocket'],
                    'force new connection': true,
                    'query': 'token=' + token
                };
                var client = io.connect(apiUrl, options);

                client.on('connect' , function(){
                    var appointment = {
                        "title": "First appointment evar",
                        "date": "22.2.2015",
                        "time": "10:50"
                    };
                    client.emit('appointment:new', appointment, function(res){
                        expect(res.message).to.be('added');
                        expect(res.status).to.be(200);
                        client.disconnect();
                        done();
                    });
                })
            })
    });
});