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

describe('User adds appointment', function(){


    it('should connect user to socket after authenticating',function(done){
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
                        "start_date": Date.now(),
                        "end_date": Date.now()
                    };
                    client.emit('appointment:new', appointment, function(res){
                        console.log(res);
                        expect(res.message).to.be('added');
                        expect(res.status).to.be(200);
                        done();
                    });

                })
            })
    });
});