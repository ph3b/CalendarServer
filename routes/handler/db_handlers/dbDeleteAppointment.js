/**
 * Created by mattiden on 18.03.15.
 */
/**
 * Created by mattiden on 13.03.15.
 */
var db = require('./../../../config/db');

module.exports = function(app_id, callback){
    var query = "delete from cal_appointment where appointment_id = ?";
    db.query(query, app_id, function(err, res){
        if(err) console.log(err);
        callback();
    })

};