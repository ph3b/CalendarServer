/**
 * Created by mattiden on 14.03.15.
 */
require('./../../server.js')('test');
var io = require('socket.io-client');
var db = require('./../../config/db.js');
var settings = require('./../../config/settings.js');
var expect = require('expect.js');


describe('User invites user to existing appointment', function(){
    /*before(function(done){
        db.query("insert into cal_appointment", app, function(err, res){
            if(!err){
                done();
            }
        })
    });
    it('Second user should get an invitation', function(done){

    })*/
});