/**
 * Created by mattiden on 17.03.15.
 */
var updateParticipantList = require('./../../routes/handler/db_handlers/dbUpdateAppointmentParticipants');
var expect = require('expect.js');
var db = require('./../../config/db');

var appointment = {
    "title": "Påskeferie",
    "description" : "Blir deilig med pause",
    "date" : "26.2.2015",
    "start_time" : "16:15",
    "end_time" : "18:15",
    "owned_by_user" : 1
};
var exisitingApp;
describe('UNIT - It should update existing participant list', function(){
    before(function(done){
        db.query('insert into cal_appointment set ?', appointment, function(err, res){
            if(!err){
                exisitingApp = res.insertId;
                db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [2, exisitingApp], function(err1, res1){
                    db.query('insert into cal_userInvitedToAppointment(user_id, appointment_id) values(?,?)', [3, exisitingApp], function(err2, res2){
                        done();
                    })
                });
            } else {
                console.log(err);
            }

        })
    });
    after(function(done){
        db.query('delete from cal_appointment', function(err, res){
            if(!err){
                done();
            }
            if(err) console.log(err);
        })
    });
    it('It should return list of user_ids which should be removed', function(done){
        var newParticipantList = [2];
        var _removedList = [3];
        var _addedList = [];
        updateParticipantList(exisitingApp, newParticipantList, function(newList, addedList, removedList){
            expect(newList).to.be(newParticipantList);
            expect(addedList[0]).to.be(undefined);
            expect(removedList.length).to.be(1);
            expect(removedList[0]).to.be(3);
            done();
        })
    });
    it('It should return list of user_ids which should be added', function(done){
        var newParticipantList = [2, 4, 5];
        var _removedList = [3];
        var _addedList = [];
        _addedList.push(4);
        _addedList.push(5);
        updateParticipantList(exisitingApp, newParticipantList, function(newList, addedList, removedList){
            expect(newList).to.be(newParticipantList);
            expect(addedList[0]).to.be(4);
            expect(addedList[1]).to.be(5);
            done();
        })
    });
    it('Should give list with both removed and added users', function(done){
        var newParticipantList = [2, 5, 9];
        updateParticipantList(exisitingApp, newParticipantList, function(newList, addedList, removedList){
            expect(newList).to.be(newParticipantList);
            expect(addedList[0]).to.be(5);
            expect(addedList[1]).to.be(9);
            expect(removedList[0]).to.be(3);
            done();
        })
    })
    it('Should give callback with null if newlist if equal oldlist', function(done){
        var newParticipantList = [2, 3];
        updateParticipantList(exisitingApp, newParticipantList, function(newList, addedList, removedList){
            expect(newList).to.be(newParticipantList);
            expect(addedList).to.be(null);
            expect(removedList).to.be(null);
            done();
        })
    });

});