var define = require('./define');

//定义话题模型
var Comment = define.Comment;

Comment.getListByTopicId = function (topicId, callback) {
        var self = Comment;
        self.find({ "topic": topicId })
                .sort({ '_id': 1 })
                .populate('author')
                .exec(callback);
};

Comment.getLastByAuthor = function (options, callback) {
        var self = Comment;
        self.find(options).sort({ '_id': -1 })
                .skip(0)
                .limit(5)
                .populate('author')
                .populate('topic')
                .exec(callback);
};

module.exports = Comment;