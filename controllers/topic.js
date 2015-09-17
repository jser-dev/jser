"use strict";

var Topic = require('../models/topic');

/**
 * 话是控制器
 **/
var TopicController = module.exports = function () { };

/**
 * 默认 action
 **/
TopicController.prototype.index = function () {
    var self = this;

    self.render("topic.html", Topic);

};