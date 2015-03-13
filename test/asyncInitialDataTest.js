/**
 * Created by mattiden on 11.03.15.
 */
var expect = require('expect.js');

var getInitialData = require('./../routes/handler/db_handlers/dbGetAppointmentForUserId');

describe('Get appointments for user', function(){
    it('should get all appointments for specified user_id',function(done){
        getInitialData(1, function(appointments){
            expect(appointments).to.be.an('array');
            done();
        })
    })
});