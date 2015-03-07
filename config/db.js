/**
 * Created by mattiden on 02.03.15.
 */
var mysql = require('mysql');
var password;

/* istanbul ignore next */
try{
    var passwordDb = require('./localstuff').dbpassword;
    console.log('Running on local');
    password = passwordDb;
}
catch(e){
    password = process.env.dbPw;
    console.log('Running on travis/server')
}

var client = mysql.createConnection({
    host: 'xlib2.mysql.domeneshop.no',
    user: 'xlib2',
    password: password,
    database : 'xlib2'
});
/* istanbul ignore next */
function replaceClientOnDisconnect(client) {
    client.on("error", function (err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== "PROTOCOL_CONNECTION_LOST") {
            throw err;
        }
        client = mysql.createConnection(client.config);
        replaceClientOnDisconnect(client);
        connection.connect(function (error) {
            if (error) {
                console.log("Fatal error on db connection");
            }
        });
    });
}
replaceClientOnDisconnect(client);

module.exports = client;
