/**
 * Created by mattiden on 02.03.15.
 */
var mysql = require('mysql');
var password;

try{
    var passwordDb = require('./localstuff').dbpassword;
    console.log('bruker lokalt');
    password = passwordDb;
}
catch(e){
    password = process.env.dbPw;
    console.log('bruker env')
}
var options = {
    host: 'xlib2.mysql.domeneshop.no',
    user: 'xlib2',
    password: password,
    database : 'xlib2'
};

var connection = mysql.createConnection(options);

var handleMySqlConnection = function(){
    var connection = mysql.createConnection(options);
    connection.connect(function(err){
        if(!err){
            console.log('Connected to MySQL database');
        }
        else if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
    connection.on('error', function(){
        handleMySqlConnection();
    })
};
handleMySqlConnection();

module.exports = connection;