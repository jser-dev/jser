var Topic = require('../models/topic');
var Comment = require('../models/comment');
var utils = require('../common/utils');
var Task = nokit.Task;

/**
 * 话是控制器
 **/
var TopicViewController = module.exports = function () {
	var self = this;
};

TopicViewController.prototype.init = function () {
	var self = this;
	self.topicId = self.context.data('id');
	var task = new Task();
	task.add('topic', function (done) {
		Topic.get(self.topicId, function (err, topic) {
			if (err) {
				return self.context.error(err);
			}
			self.topic = topic;
			topic.read++;
			topic.save();
			topic.html = topic.html || utils.md2html(topic.content);
			topic.comments.forEach(function (comment) {
				comment.html = comment.html || utils.md2html(comment.content);
			});
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
 * 加精一个话题
 **/
TopicViewController.prototype.good = function () {
	var self = this;
	Topic.good(self.topicId, function (err) {
		if (err) {
			return self.context.error(err);
		}
		self.index();
	});
};

/**
 * 添加评论
 **/
TopicViewController.prototype.comment = function () {
	var self = this;
	var content = self.context.data('content');
	var comment = new Comment();
	comment.content = content;
	comment.html = utils.md2html(comment.content);
	comment.author = self.context.user;
	comment.topic = self.topic;
	comment.save(function (err) {
		if (err) {
			return self.context.error(err);
		}
		self.topic.replay++;
		self.topic.lastReplayAt = comment.updateAt;
		self.topic.lastReplayAuthor = self.context.user;
		self.topic.save(function (err) {
			if (err) {
				return self.context.error(err);
			}
			self.context.redirect("/topic/" + self.topicId + '#' + comment.id);
		});
	});
};