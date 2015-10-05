"use strict";

var Topic = require('../models/topic');
var Comment = require('../models/comment');
var Mditor = require('mditor');
var Task = nokit.Task;

/**
 * 话是控制器
 **/
var TopicViewController = module.exports = function () {
	var self = this;
	self.mdParser = new Mditor.Parser({});
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
			topic.html = self.mdParser.parse(topic.content);
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

TopicViewController.prototype.comment = function () {
	var self = this;
	var content = self.context.data('content');
	var comment = new Comment();
	comment.content = content;
	comment.author = self.context.user;
	comment.topic = self.topic;
	comment.save(function (err) {
		if (err) {
			return self.context.error(err);
		}
		self.topic.lastReplayAt = comment.updateAt;
		self.topic.lastReplayAuthor = self.context.user;
		self.topic.save(function (err) {
			if (err) {
				return self.context.error(err);
			}
			self.render("topic-view.html", {
				id: self.topicId,
				topic: self.topic,
				user: self.context.user
			});
		});
	});
};