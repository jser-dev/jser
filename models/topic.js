var db = require("../common/db");

var Topic = module.exports = db.model('topic', {
    title: String,
    content: String
});

Topic.load = function (callback) {
    var self = Topic;
    self.find({}, callback);
};