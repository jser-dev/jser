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
    Topic.loadTypes(function (types) {
        self.render("topic-edit.html", {
            types: types
        });
    });
};

TopicEditController.prototype.submit = function () {
    var self = this;
    Topic.loadTypes(function (types) {
        self.render("topic-edit.html", {
            types: types
        });
    });
};