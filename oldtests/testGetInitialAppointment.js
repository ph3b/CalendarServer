/**
 * Created by mattiden on 03.03.15.
 */
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
var jwt = require('jsonwebtoken');

var apiUrl = 'http://localhost:3000';

describe('Initial loads', function(){
    it('Should get initial appointments',function(done){
        this.timeout(5000);
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
                   client.on('appointment:initialreceive', function(appointments){
                       expect(appointments).to.be.an('array');
                       expect(appointments[0].owned_by_user).to.be(1);
                       expect(appointments[0].appointment_id).to.a("number");
                       client.disconnect();
                       done();
                   })
                })
            })
    });
});