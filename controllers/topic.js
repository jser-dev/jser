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

    var topicType = self.context.data('type') || 'all';
    var pageIndex = self.context.data('pageIndex') || 1;

    Topic.loadTypes(function (types) {
        self.render("topic.html", {
            types: types,
            currentType: topicType
        });
    });

};