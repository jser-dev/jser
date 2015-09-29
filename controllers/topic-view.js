"use strict";

var Topic = require('../models/topic');

/**
 * 话是控制器
 **/
var TopicViewController = module.exports = function () { };

/**
 * 默认 action
 **/
TopicViewController.prototype.index = function () {
    var self = this;
	self.render("topic-view.html");
};

TopicViewController.prototype.comment = function () {
	var self = this;
	self.render("topic-view.html");
};