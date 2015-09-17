var db = require("../common/db");

var User = module.exports = db.model('user', {
    title: String,
    content: String
});

User.load = function (callback) {
    var self = User;
    self.find({}, function (err, list) {
        self.list = list;
        if (callback) callback(err, list);
    });
};