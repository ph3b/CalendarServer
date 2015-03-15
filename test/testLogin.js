var expect = require('expect.js');
var send = require('superagent');
var io = require('socket.io-client');
var apiUrl = 'http://localhost:3000';

describe('User logs in', function(){
    it('should give user token when sending valid credentials',function(done){
        var credentials = {"username": "mathias", "password": "hawaii"};
        send.post(apiUrl + '/login')
            .send(credentials)
            .end(function(err, res){
                expect(res.body.token).to.be.a('string');
                expect(res.body.token.split(".").length).to.be(3);
                expect(res.body.message).to.be('ok');
                expect(res.body.status).to.be(200);
                done();
            })
    });

    it('should give user error when sending invalid credentials',function(done){
        var invalidCredentials = {"username": "mathias", "password": "invalidpassword"};

        send.post(apiUrl + '/login')
            .send(invalidCredentials)
            .end(function(err, res){
                expect(res.body.token).to.be(undefined);
                expect(res.body.message).to.be('Invalid credentials');
                expect(res.body.status).to.be(401);
                done();
            })
    });
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
                    client.disconnect();
                    done();

                })
            })
    });
    it('should not connect user to socket if no token is provided',function(done){
        var options = {
            transports: ['websocket'],
            'force new connection': true
        };
        var client = io.connect(apiUrl, options);
        client.on('error' , function(response){
            expect(response).to.eql('Not authorized');
            client.disconnect();
            done();

        });
    });
});