var define = require('./define');
var status = require("./status").comment;

/**
 * 定义评论模型
 **/
var Comment = define.Comment;

/**
 * 根据 topicId 获取评论列表
 **/
Comment.getListByTopicId = function (topicId, callback) {
        var self = Comment;
        self.find({ "topic": topicId })
                .sort({ '_id': 1 })
                .populate('author')
                .exec(callback);
};

/**
 * 根据 userId 获取用户最近的评论
 **/
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