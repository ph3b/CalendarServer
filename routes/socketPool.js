/**
 * Created by mattiden on 03.03.15.
 */
var jwt = require('jsonwebtoken');
var settings = require('./../config/settings.js');

var pool = [];

var addSocketToPool = function(socket){
    var user_id = jwt.decode(socket.handshake.query.token, settings.secret).user_id;
    pool.push({"user_id": user_id, socket: socket});
};

var removeSocket = function(socket){
    for(var i = 0; i < pool.length; i++){
        if(pool[i].socket == socket){
            pool.splice(i, 1);
            return;
        }
    }
    return -1;
};
var findSocketByUserId = function(user_id){
    for(var i = 0; i < pool.length; i++){
        if(pool[i].user_id == user_id){
            return pool[i].socket;
        }
        else {
            return -1
        }
    }
};
module.exports = {
    "pool" : pool,
    "removeSocket": removeSocket,
    "findSocketByUserId": findSocketByUserId,
    "addSocketToPool": addSocketToPool
};