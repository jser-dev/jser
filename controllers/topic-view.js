"use strict";

var Topic = require('../models/topic');
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
	self.render("topic-view.html", {
		id: self.topicId,
		topic: self.topic
	});
};