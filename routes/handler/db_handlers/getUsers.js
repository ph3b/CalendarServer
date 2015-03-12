/**
 * Created by mattiden on 12.03.15.
 */
var db = require('./../../../config/db');
var settings = require('./../../../config/settings.js');
var jwt = require('jsonwebtoken');

module.exports = function(callback){
    var query = "SELECT user_id, fullname from cal_user";
    db.query(query, function(err, res){
        if(typeof(callback) === typeof(Function)) callback(res);
    })
};