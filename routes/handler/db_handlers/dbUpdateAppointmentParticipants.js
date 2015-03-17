/**
 * Created by mattiden on 17.03.15.
 */
var db = require('./../../../config/db');
var getSerializedAppointment = require('./dbGetAppointmentDetails');

module.exports = function(appointment_id, newParticipantList, callback){
    getSerializedAppointment(appointment_id, function(existingApp){
        var formatList = function(unformattedList){
            var list = [];
            unformattedList.forEach(function(user){
                list.push(user.user_id);
            });
            return list;
        };

        var findRemovedUsers = function(newList, oldList){
            var list = [];
            oldList.forEach(function(old_user_id){
                if(newList.indexOf(old_user_id) == -1){
                    list.push(old_user_id);
                }
            });
            return list;
        };
        var findAddedUsers = function(newlist, oldList){
            var list = [];
            newlist.forEach(function(new_user_id){
                if(oldList.indexOf(new_user_id) == -1){
                    list.push(new_user_id);
                }
            });
            return list;
        };
        var newList = newParticipantList;
        var oldList = formatList(existingApp.participants);

        if(findAddedUsers(newList, oldList).length == 0 && findRemovedUsers(newList, oldList).length == 0){
            if(typeof(callback) === typeof(Function)) callback(newList, null, null);
        }
        else {
            if(typeof(callback) === typeof(Function)) callback(newList, findAddedUsers(newList, oldList), findRemovedUsers(newList, oldList));
        }
    });
};