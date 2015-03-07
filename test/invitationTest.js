/**
 * Created by mattiden on 04.03.15.
 */
var socketPool = require('../routes/socketPool.js');
var expect = require('expect.js');
var http = require('superagent');
var io = require('socket.io-client');
var jwt = require('jsonwebtoken');
var settings = require('./../config/settings.js');
var db = require('./../config/db.js');

var apiUrl = 'http://localhost:3000';

var user1 = {"username" : "mathias", "user_id" : 1};
var user2 = {"username" : "erlend", "user_id": 2};

var client1options = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(user1, settings.secret)
};
var client2options = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(user2, settings.secret)
};

describe('User invites second user to appointment', function(){
        it('Client one should send invitation to client two.',function(done){
            var client1 = io.connect(apiUrl, client1options);
            client1.on('connect', function(){

                var client2 = io.connect(apiUrl,client2options);
                client2.on('connect', function(){

                    db.query('select * from cal_appointment limit 1', function(err, appointment){
                        var sendInvitationTo = {"user_id": 2, "appointment_id": appointment[0].appointment_id};
                        client1.emit('appointment:sendinvitation', sendInvitationTo);
                        client2.on('appointment:get', function(app){
                            client2.on('invitation:get', function(inv){
                                expect(inv.user_id).to.be.eql(2);
                                expect(app.owned_by_user).to.be.eql(1);
                                expect(app.appointment_id).to.be.eql(inv.appointment_id);
                                client1.disconnect();
                                client2.disconnect();
                                done();
                            })
                        });
                    });

                })
            })
        })
});