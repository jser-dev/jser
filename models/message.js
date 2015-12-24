/* global nokit */
var define = require('./define');
var status = require("./status").message;
var utils = require("../common/utils");
var Task = nokit.Task;
var User = require("./user");

/**
 * 定义站内消息模型
 **/
var Message = define.Message;

/**
 * 获取所有消息
 **/
Message.getAllByUserId = function (userId, callback) {
	var self = this;
	self.find({
		"to": userId,
		"status": {"$ne":status.DELETED}
		})
		.sort({ "status":1, "_id": -1 })
		.exec(callback);
};

/**
 * 获取所有已读消息
 **/
Message.getReadByUserId = function (userId, callback) {
	var self = this;
	self.find({
		"to": userId,
		"status": status.READ})
		.sort({ '_id': -1 })
		.exec(callback);
};

/**
 * 获取所有未读消息
 **/
Message.getUnreadByUserId = function (userId, callback) {
	var self = this;
	self.find({
		"to":userId,
		"status": status.UNREAD})
		.sort({ '_id': -1 })
		.exec(callback);
};

/**
 * 全部标记为已读
 **/
Message.markAllAsReadByUserId = function (userId, callback) {
	var self = this;
	self.update({ 
		"to":userId,
		"status":{"$ne":status.DELETED}
		},
		{ $set: { "status":status.READ }},
		callback);
};

/**
 * 标记为已读
 **/
Message.markAsReadById = function (id, callback) {
	var self = this;
	self.findById(id,function(err,msg){
		if(err){
			return callback(err);
		}
		if(msg.status!=status.DELETED){
			msg.status=status.READ;
		}
		msg.save();
		callback(null,msg);
	});
};

/**
 * 删除
 **/
Message.deleteAllByUserId = function (userId, callback) {
	var self = this;
	self.remove({ 
		"to":userId},callback);
};

Message.deleteById=function(id,callback){
	var self = this;
	self.remove({ 
		"_id":id.toString() },callback);
};

/**
 * 发送消息
 **/
Message.send=function(from,toList,msgInfo,callback){
	if(!utils.isArray(toList)){
		toList=[toList];
	}
	var task = new Task();
    User.getUsersByNames(toList,function(err,users){
        users.forEach(function(user){
            task.add(function(done){
               if(err || !user)return;
				var msg = new Message();
				msg.to=user._id.toString();
				msg.from = from;
				msg.sendAt=new Date();
				msg.status=status.UNREAD;
				msg.content = msgInfo.content;
				msg.link = msgInfo.link;
				msg.save(done);
            });
        });
    });
	task.end(callback);
};

module.exports = Message;