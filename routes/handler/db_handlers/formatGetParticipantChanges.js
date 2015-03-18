/**
 * Created by mattiden on 17.03.15.
 */
var db = require('./../../../config/db');
var getSerializedAppointment = require('./dbGetAppointmentDetails');
var participantList = require('./../helpers/helperParticipantList');

module.exports = function(appointment_id, newList, callback){
    getSerializedAppointment(appointment_id, function(existingApp){
        var addedUsers = [];
        var removeUsers = [];
        var oldList = participantList.formatList((existingApp.participants));
        addedUsers = participantList.findAddedUsers(newList, oldList);
        removeUsers = participantList.findRemovedUsers(newList, oldList);

        if(newList.length === 0 && oldList.length === 0){
           if(typeof(callback) === typeof(Function)) callback("nothing", null, null);
        }
        else if(addedUsers.length > 0  && removeUsers.length === 0){
            if(typeof(callback) === typeof(Function)) callback("add", addedUsers, null);
        }
        else if(addedUsers.length === 0  && removeUsers.length > 0){
            if (typeof(callback) === typeof(Function)) callback("remove", null, removeUsers);
        }
        else if(addedUsers.length > 0  && removeUsers.length > 0){
            if (typeof(callback) === typeof(Function)) callback("addAndRemove", addedUsers, removeUsers);
        }
        else if(addedUsers.length === 0  && removeUsers.length === 0){
            if(typeof(callback) === typeof(Function)) callback("nothing", null, null);
        }
        else {
            console.log("Dette skulle jo ikke skje!");
            callback(null,null, null)
        }
    });
};