/**
 * Created by mattiden on 12.03.15.
 */
var updateAppointment = require('./../routes/handler/db_handlers/updateAppointment');
var db = require('./../config/db.js');
var expect = require('expect.js');


describe("Should update appointment", function(){
    it('should return success when appointment is updated correctly',function(done){
        this.timeout(10000);
        var appointment = {
                "title": "Sprintmøte",
                "description" : "Møte med teameet!",
                "date": "21.2.2015",
                "start_time": "10:50",
                "end_time": "15:00"
        };
        var sql = "insert into cal_appointment set ?";
        db.query(sql, appointment, function(err, res){
            if(err){
                console.log(err)
            }
            var editAppointment = {
                "title": "Oppdatert tittel",
                "description" : "Oppdatert desc",
                "date" : "2.2.2015",
                "start_time" : "20:00",
                "end_time" : "21:00",
                appointment_id : res.insertId
            };
            updateAppointment(editAppointment, function(err, updateRes){
                db.query('select * from cal_appointment where appointment_id = ?', res.insertId, function(err, updatedApp){
                    expect(updatedApp[0].appointment_id).to.be.eql(res.insertId);
                    expect(updatedApp[0].title).to.be.eql("Oppdatert tittel");
                    expect(updatedApp[0].description).to.be.eql("Oppdatert desc");
                    expect(updatedApp[0].date).to.be.eql("2.2.2015");
                    expect(updatedApp[0].start_time).to.be.eql("20:00");
                    expect(updatedApp[0].end_time).to.be.eql("21:00");
                    db.query('delete from cal_appointment where appointment_id = ? ', res.insertId, function(err, res){
                        console.log(res);
                        done()
                    });
                });
            })
        });
    })
});
