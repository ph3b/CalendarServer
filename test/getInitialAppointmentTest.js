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
                   client.on('appointment:get', function(appointments){
                       expect(appointments).to.be.an('array');
                       client.disconnect();
                       done();
                   })
                })
            })
    });
});