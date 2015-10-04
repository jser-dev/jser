"use strict";

var Topic = require('../models/topic');
var Comment = require('../models/comment');
var Mditor = require('mditor');

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
	Topic.get(self.topicId, function (err, topic) {
		topic.content = self.mdParser.parse(topic.content);
		self.topic = topic;
		topic.read++;
		topic.save();
		self.ready();
	})
};

/**
 * 默认 action
 **/
TopicViewController.prototype.index = function () {
    var self = this;
	self.render("topic-view.html", {
		id: self.topicId,
		topic: self.topic
	});
};

TopicViewController.prototype.comment = function () {
	var self = this;
	self.context.session.get('user', function (user) {
		var content = self.context.data('content');
		var comment = new Comment();
		comment.content = content;
		comment.author = user;
		self.topic.comments.push(comment);
		self.topic.save(function (err) {
			if (err) {
				return self.context.error(err);
			}
			self.render("topic-view.html", {
				id: self.topicId,
				topic: self.topic
			});
		});
	});
};