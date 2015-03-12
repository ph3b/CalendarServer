/**
 * Created by mattiden on 11.03.15.
 */
var expect = require('expect.js');

var getInitialData = require('./../routes/handler/db_handlers/getAppointmentsForCurrentUser');

describe('Get current data unit test', function(){
    it('should get all appointments',function(done){
        getInitialData(553, function(err, res){
            done();
        })
    })
});
