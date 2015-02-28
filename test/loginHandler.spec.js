/**
 * Created by mattiden on 28.02.15.
 */

require('../server.js');
var io = require('socket.io-client');
var expect = require('expect.js');

var apiUrl = 'http://0.0.0.0:3000';

var options ={
    transports: ['websocket'],
    'force new connection': true
};

describe('User logs in', function(){
    it('should give user token when sending valid credentials',function(done){
        var credentials = {"username": "mathias", "password": "tennis"};
        var client = io.connect(apiUrl, options);
        client.on('connect', function(){
            client.emit('user:login', credentials, function(response){
                expect(response.status).to.be(200);
                expect(response.message).to.be('ok');
                var token = response.token;
                expect(token.split(".").length).to.be(3);
                client.disconnect();
                done();
            })
        })
    });
    it('should give error when user sends invalid credentials',function(done){
        var credentials = {"username": "mathias", "password": "feilpassord"};
        var client = io.connect(apiUrl, options);

        client.on('connect', function(){
            client.emit('user:login', credentials, function(response){
                expect(response.status).to.be(401);
                expect(response.message).to.be('Invalid credentials');
                expect(response.token).to.be(undefined);
                client.disconnect();
                done();
            })
        })
    });
});
