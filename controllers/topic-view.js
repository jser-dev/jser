/* global nokit */
var Topic = require('../models/topic');
var Comment = require('../models/comment');
var status = require('../models/status');
var utils = require('../common/utils');
var Task = nokit.Task;

/**
 * 话题控制器
 **/
var TopicViewController = module.exports = function () { };

TopicViewController.prototype.init = function () {
	var self = this;
	self.topicId = self.context.data('id');
	var task = new Task();
	task.add('topic', function (done) {
		Topic.get(self.topicId, function (err, topic) {
			if (err) {
				return self.context.error(err);
			}
			if (!topic ||
				(topic.status != status.PUBLISH &&
					self.context.route.action != 'delete')) {
				return self.context.notFound();
			}
			self.topic = topic;
			done();
		});
	});
	task.end(function () {
		self.ready();
	});
};

/**
 * 默认 action
 **/
TopicViewController.prototype.index = function () {
    var self = this;
	//阅读数 +1
	self.topic.read++;
	self.topic.save();
	self.render("topic-view.html", {
		id: self.topicId,
		topic: self.topic,
		user: self.context.user
	});
};

/**
 * 删除一个贴子
 **/
TopicViewController.prototype.delete = function () {
	var self = this;
	Topic.delete(self.topicId, function (err) {
		if (err) {
			return self.context.error(err);
		}
		self.context.redirect("/topic");
	});
};

/**
 * 将话题添加精华
 **/
TopicViewController.prototype.setGood = function () {
	var self = this;
	Topic.setGood(self.topicId, function (err) {
		if (err) {
			return self.context.error(err);
		}
		self.context.redirect("/topic/" + self.topicId + "#control");
	});
};

/**
 * 将话题移除精华
 **/
TopicViewController.prototype.removeGood = function () {
	var self = this;
	Topic.removeGood(self.topicId, function (err) {
		if (err) {
			return self.context.error(err);
		}
		self.context.redirect("/topic/" + self.topicId + "#control");
	});
};

/**
 * 将话题置顶
 **/
TopicViewController.prototype.setTop = function () {
	var self = this;
	Topic.setTop(self.topicId, function (err) {
		if (err) {
			return self.context.error(err);
		}
		self.context.redirect("/topic/" + self.topicId + "#control");
	});
};

/**
 * 将话题移除置顶
 **/
TopicViewController.prototype.removeTop = function () {
	var self = this;
	Topic.removeTop(self.topicId, function (err) {
		if (err) {
			return self.context.error(err);
		}
		self.context.redirect("/topic/" + self.topicId + "#control");
	});
};

/**
 * 添加评论
 **/
TopicViewController.prototype.addComment = function () {
	var self = this;
	var content = self.context.data('content');
	var comment = new Comment();
	comment.content = content;
	comment.author = self.context.user;
	comment.topic = self.topic;
	Comment.save(comment, function (err) {
		if (!err) {
			self.context.redirect("/topic/" + self.topicId + '#' + comment.id);
		}
		self.render("topic-view.html", {
			"commentMessage": err + "<script>location.href+='#comment-editor'</script>",
			"id": self.topicId,
			"topic": self.topic,
			"user": self.context.user,
			"newComment": content
		});
	});
};

/**
 * 删除一个评论
 **/
TopicViewController.prototype.delComment = function () {
	var self = this;
	var commentId = self.context.data("commentId");
	Comment.delete(commentId, function (err) {
		if (err) {
			return self.context.error(err);
		}
		self.context.redirect("/topic/" + self.topicId + "#comments");
	});
};