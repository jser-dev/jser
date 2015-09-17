var db = require("../common/db");

var Topic = module.exports = db.model('topic', {
    title: String,
    content: String
});

Topic.load = function(callback) {
    var self = Topic;
    self.find({}, function(err, list) {
        self.list = list;
        if (callback) callback(err, list);
    });
};

var testIndex = 0;
Topic.testAdd = function(callback) {
    var topic = new Topic();
    topic.title = "test" + (++testIndex);
    topic.content = topic.title + '...';
    topic.save(callback);
};