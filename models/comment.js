"use strict";

var define = require('./define');

//定义话题模型
var Comment = module.exports = define.Comment;

Comment.getListByTopicId = function (topicId, callback) {
        var self = Comment;
        self.find({ "topic": topicId })
                .sort({ '_id': 1 })
                .populate('author')
                .exec(callback);
};