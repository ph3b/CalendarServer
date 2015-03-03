var socketPool = require('../routes/socketPool.js');
var expect = require('expect.js');
var http = require('superagent');
var io = require('socket.io-client');
var jwt = require('jsonwebtoken');
var settings = require('./../config/settings.js');

var apiUrl = 'http://localhost:3000';

var mathias = {"username" : "mathias", "user_id" : 1};
var erlend = {"username" : "erlend", "user_id":5};

var optionsMathias = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(mathias, settings.secret)
};
var optionsErlend = {
    transports: ['websocket'],
    'force new connection': true,
    'query': 'token=' + jwt.sign(erlend, settings.secret)
};

describe('Socket pool live test', function(){

    it('should add socket to socket pool after login in',function(done){
        var client = io.connect(apiUrl, optionsMathias);

        client.on('connect', function(){
            expect(socketPool.pool.length).to.be.eql(1);
            client.disconnect();
            done();
        })
    });

    it('Pool should contain two sockets after two clients log in',function(done){
        var mathiasSocket = io.connect(apiUrl, optionsMathias);

        mathiasSocket.on('connect', function(){
            var erlendSocket = io.connect(apiUrl, optionsErlend);
            erlendSocket.on('connect', function(){
                expect(socketPool.pool.length).to.be.eql(2);
                erlendSocket.disconnect();
                mathiasSocket.disconnect();
                done();
            })
        });
    });
    it('Socket pool should be empty after user disconnects',function(done){
        var client = io.connect(apiUrl, optionsMathias);
        client.on('connect', function(){

            client.disconnect();
        });
        setTimeout(function(){
            expect(socketPool.pool.length).to.be.eql(0);
            done();
        },500)

    });
    it('Client1 should be able to find client2 socket when both are connected',function(done){
        var mathiasSocket = io.connect(apiUrl, optionsMathias);
        mathiasSocket.on('connect', function(){
            var erlendSocket = io.connect(apiUrl, optionsErlend);
            erlendSocket.on('connect', function(){
                // Because the socket is unequal on the server and client we have to compare the token
                // on the socket returned. We can decode it and is it if matches the user_id we searched for.
                var clientWeSearchedFor = socketPool.findSocketByUserId(1);
                var clientWeSearchedForUserId = jwt.verify(clientWeSearchedFor.handshake.query.token, settings.secret).user_id;
                expect(clientWeSearchedForUserId).to.be(1);
                erlendSocket.disconnect();
                mathiasSocket.disconnect();
                done();
            })
        });
    })
});