var define = require('./define');
var status = require("./status").comment;

//定义话题模型
var Comment = define.Comment;

Comment.getListByTopicId = function (topicId, callback) {
        var self = Comment;
        self.find({ "topic": topicId })
                .sort({ '_id': 1 })
                .populate('author')
                .exec(callback);
};

Comment.getLastByUserId = function (userId, callback) {
        var self = Comment;
        self.find({
                author: userId,
                status: status.PUBLISH
        }).sort({ '_id': -1 })
                .skip(0)
                .limit(5)
                .populate('author')
                .populate('topic')
                .exec(callback);
};

module.exports = Comment;