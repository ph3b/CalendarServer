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

};
var connection = mysql.createConnection({
    host: 'xlib2.mysql.domeneshop.no',
    user: 'xlib2',
    password: 'LxY2FMui2xwcZYF',
    database : 'xlib2'
});

connection.connect(function(err){
    if(!err){
        console.log('Connected to MySQL database');
    } else {
        console.log(err);
    }
});

module.exports = connection;