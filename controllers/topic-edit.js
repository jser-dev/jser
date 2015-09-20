"use strict";

var Topic = require('../models/topic');

/**
 * 话是控制器
 **/
var TopicEditController = module.exports = function () { };

/**
 * 默认 action
 **/
TopicEditController.prototype.index = function () {
    var self = this;
    self.render("topic-edit.html", Topic);
};