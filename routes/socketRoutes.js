/**
 * Created by mattiden on 28.02.15.
 */
var loginHandler = require('./handler/loginHandler.js');

module.exports = function(io){
    io.on('connection', function(client){
        loginHandler(client);
    })
};