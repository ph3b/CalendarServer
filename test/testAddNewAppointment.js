/**
 * Created by mattiden on 02.03.15.
 */
require('./../server.js')('test');
var expect = require('expect.js');
var send = require('superagent');
var io = require('socket.io-client');
var db = require('./../config/db.js');
var settings = require('./../config/settings.js');
var jwt = require('jsonwebtoken');

var apiUrl = 'http://localhost:3000';

var credentials = {"username": "mathias", "user_id" : 1};

var clientOptions = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(credentials, settings.secret)
};

describe('User creates new appointment', function(){
    this.timeout(10000);
    before(function(done){
        db.query('delete from cal_appointment', function(err, res){
            done();
        });
    });

    after(function(done){
        db.query('delete from cal_appointment', function(res){
            done();
        });
    });

    it('Should add new appointment and send it back serialized',function(done){
        this.timeout(5000);

        var client = io.connect(apiUrl, clientOptions);
        var appointment = {
            "title": "Sprintmøte",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "10:50",
            "end_time": "15:00"
        };
        client.on('connect' , function(){
            client.emit('appointment:new', appointment);
            client.on('appointment:get', function(app){
                expect(app.appointment_id).to.be.a('number');
                expect(app.description).to.be.a('string');
                expect(app.title).to.be.a('string');
                expect(app.owned_by_user).to.be(1);
                expect(app.participants).to.be.an('array');

                expect(app).to.have.property('title');
                expect(app).to.have.property('description');
                expect(app).to.have.property('date');
                expect(app).to.have.property('start_time');
                expect(app).to.have.property('end_time');
                expect(app).to.have.property('participants');
                expect(app).to.have.property('owned_by_user');
                client.disconnect();
                done();
            })

        })
    });
    it('Should give callback when new appointment is added',function(done){
        this.timeout(5000);

        var client = io.connect(apiUrl, clientOptions);
        var appointment = {
            "title": "Sprintmøte",
            "description" : "Møte med teameet!",
            "date": "21.2.2015",
            "start_time": "10:50",
            "end_time": "15:00"
        };
        client.on('connect' , function(){
            client.emit('appointment:new', appointment, function(response){
                expect(response.message).to.be('added');
                expect(response.status).to.be(200);
                client.disconnect();
                done();
            });
        })
    });
});