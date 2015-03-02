/**
 * Created by mattiden on 02.03.15.
 */
var loginHandler = require('./handler/loginHandler.js');

module.exports = function(app){
    app.post('/login', loginHandler); // Logs in user and provides JWT
};