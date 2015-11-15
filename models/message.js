var define = require('./define');
var status = require("./status").message;
var utils = require("../common/utils");

//定义话题模型
var Message = define.Message;

/**
 * 获取所有消息
 **/
Message.getAllByUserId = function (userId, callback) {
	var self = Comment;
	self.find({
		"to": userId,
		})
		.sort({ '_id': 1 })
		.exec(callback);
};

/**
 * 全部标记为已读
 **/
Message.markAllToReadByUserId = function (userId, callback) {
	var self = Comment;
	self.update({ status: status.UNREAD },
	 { $set: { status:status.READ }},
	 callback);
};

/**
 * 全部标记为已读
 **/
Message.deleteAllByUserId = function (userId, callback) {
	var self = Comment;
	self.update({ status: {$ne:status.DELETED} }, 
	{ $set: { status:status.DELETED }},
	callback);
};

/**
 * 获取所有已读消息
 **/
Message.getReadByUserId = function (userId, callback) {
	var self = Comment;
	self.find({
		"to": userId,
		"status": status.READ})
		.sort({ '_id': 1 })
		.exec(callback);
};

/**
 * 获取所有未读消息
 **/
Message.getUnreadByUserId = function (userId, callback) {
	var self = Comment;
	self.find({
		"to": userId,
		"status": status.UNREAD})
		.sort({ '_id': 1 })
		.exec(callback);
};

module.exports = Comment;