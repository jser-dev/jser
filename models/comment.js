var define = require('./define');
var status = require("./status").comment;
var utils = require('../common/utils');
var score = require('./score');

/**
 * 定义评论模型
 **/
var Comment = define.Comment;

/**
 * 根据 topicId 获取评论列表
 **/
Comment.getListByTopicId = function (topicId, callback) {
	var self = Comment;
	self.find({ "topic": topicId, status: status.PUBLISH })
		.sort({ '_id': 1 })
		.populate('author')
		.exec(callback);
};

/**
 * 删除一个话题下的所有评论
 **/
Comment.deleteByTopicId = function (topicId, callback) {
	var self = this;
	self.update({ "topic": topicId }, { $set: { "status": status.DELETED } }, callback);
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

/**
 * 保存一个评论
 **/
Comment.save = function (comment, callback) {
	if (!comment.content || comment.content.length < 10) {
		return callback("评论内容不能少于 10 个字");
	}
	comment.status = comment.status || status.PUBLISH;
	comment.html = utils.md2html(comment.content);
	comment.save(function (err) {
		if (err) {
			return callback(err);
		}
		comment.topic.replay++;
		comment.topic.lastReplayAt = comment.updateAt;
		comment.topic.save(callback);
		score.add(comment.author._id || comment.author, "comment-add");
	});
};

/**
 * 删除一个评论
 **/
Comment.delete = function (commentId, callback) {
	var self = this;
	self.findById(commentId)
		.populate('topic')
		.exec(function (err, comment) {
			if (err) {
				return callback(err);
			}
			//对应贴子回复数 -1
			comment.topic.replay--;
			comment.topic.save();
			//逻辑删除
			comment.status = status.DELETED;
			comment.save(callback);
			//计算用户得分
			score.add(comment.author._id || comment.author, "comment-del");
		});
};

module.exports = Comment;