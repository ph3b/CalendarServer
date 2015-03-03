/**
 * Created by mattiden on 03.03.15.
 */

var socketPool = require('../routes/socketPool.js');
var except = require('expect.js');
var jwt = require('jsonwebtoken');
var settings = require('./../config/settings.js');

var token = jwt.sign({"username": "mathias", "user_id": 4}, settings.secret);

var socket = {"number": 5,
    "handshake" : {
        "query" : {
            "token": token
        }
    }
};
var socket2 = {"number": 6,
    "handshake" : {
        "query" : {
            "token": token
        }
    }
};

describe('Socket pool unit test', function(){
    it('should add socket to socketpool',function(done){
        socketPool.addSocketToPool(socket);
        except(socketPool.pool).to.be.an('array');
        except(socketPool.pool.length).to.be(1);
        done();
    });
    it('should find the added socket by user_id',function(done){
        except(socketPool.findSocketByUserId(4)).to.be.eql(socket);
        done();
    });
    it('should return -1 when no socket exists',function(done){
        except(socketPool.findSocketByUserId(8)).to.be.eql(-1);
        done();
    });
    it('should remove socket from list',function(done){
        socketPool.removeSocket(socket);
        except(socketPool.pool.length).to.be.eql(0);
        done();
    });
    it('should return -1 when socket not found',function(done){
        except(socketPool.removeSocket(socket2)).to.be.eql(-1);
        done();
    })
});