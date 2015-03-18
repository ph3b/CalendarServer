/**
 * Created by mattiden on 18.03.15.
 */
var deleteInvitation = require('./../routes/handler/db_handlers/dbDeleteInvitations');
var expect = require('expect.js');
var db = require('./../config/db');


describe('UNIT - It should delete invited users from appointment', function(){
    var appointment = {
        "title": "Påskeferie",
        "description" : "Blir deilig med pause",
        "date" : "26.2.2015",
        "start_time" : "16:15",
        "end_time" : "18:15",
        "owned_by_user" : 1
    };
    var existingApp;
    before(function(done){
        db.query("insert into cal_appointment set ? ", appointment, function(err, res){
            if(!err){
                existingApp = res.insertId
                db.query("insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)", [2,existingApp], function(err, res1){
                    db.query("insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)", [3,existingApp], function(err, res2){
                        db.query("insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)", [552,existingApp], function(err, res2){
                            done();
                        })
                    })
                })
            }
        })
    });
    after(function(done){
        db.query("delete from cal_appointment where appointment_id = ?", existingApp, function(err, res){
            if(err) console.log(err);
            else{
                done();
            }
        })
    });
    it('Should delete invited users from appointment', function(done){
        var listOfUsersToDelete = [3,552];
        deleteInvitation(listOfUsersToDelete, existingApp, function(respons){

            db.query('select * from cal_userInvitedToAppointment where appointment_id = ?', existingApp, function(err, res3){
                if(err) console.log(err);
                expect(respons).to.be(1);
                expect(res3.length).to.be(1);
                done();
            })
        })
    })
});