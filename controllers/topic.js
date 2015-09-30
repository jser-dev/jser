"use strict";

var Topic = require('../models/topic');

/**
 * 话是控制器
 **/
var TopicController = module.exports = function () { };

TopicController.prototype.init = function () {
    var self = this;
    self.currentType = self.context.data('type') || 'all';
    self.pageIndex = self.context.data('pageIndex') || 1;
    Topic.loadTypes(function (err, types) {
        self.types = types;
        self.ready();
    });
};

/**
 * 默认 action
 **/
TopicController.prototype.index = function () {
    var self = this;
    Topic.getList({
        pageSize: 20,
        pageIndex: self.pageIndex,
        type: self.currentType
    }, function (err, list) {
        self.render("topic.html", {
            types: self.types,
            currentType: self.currentType,
            pageIndex: self.pageIndex,
            list: list
        });
    });

};