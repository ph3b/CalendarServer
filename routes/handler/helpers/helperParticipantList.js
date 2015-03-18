/**
 * Created by mattiden on 17.03.15.
 */
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
        if(parseInt(newList.indexOf(old_user_id.toString())) == -1){
            list.push(old_user_id);
        }
    });
    return list;
};
var findAddedUsers = function(newlist, oldList){
    var list = [];
    newlist.forEach(function(new_user_id){
        if(oldList.indexOf(parseInt(new_user_id)) == -1){
            list.push(new_user_id);
        }
    });
    return list;
};
module.exports = {
    "findAddedUsers": findAddedUsers,
    "findRemovedUsers" : findRemovedUsers,
    "formatList" : formatList
};