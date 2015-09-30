"use strict";

var Topic = require('../models/topic');

/**
 * 话是控制器
 **/
var TopicEditController = module.exports = function () { };

TopicEditController.prototype.init = function () {
    var self = this;
    Topic.loadTypes(function (types) {
        self.topicTypes = types;
        self.ready();
    });
};

/**
 * 默认 action
 **/
TopicEditController.prototype.index = function () {
    var self = this;
    self.render("topic-edit.html", {
        types: self.topicTypes
    });
};

TopicEditController.prototype.submit = function () {
    var self = this;
    self.render("topic-edit.html", {
        types: self.topicTypes
    });
};