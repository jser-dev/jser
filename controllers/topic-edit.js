"use strict";

var Topic = require('../models/topic');

/**
 * 话是控制器
 **/
var TopicEditController = module.exports = function () { };

TopicEditController.prototype.init = function () {
    var self = this;
    Topic.loadTypes(function (err, types) {
        if (err) {
            return self.context.error(err);
        }
        self.topicId = self.context.data('id');
        self.topicTypes = types;
        self.ready();
    });
};

TopicEditController.prototype.new = function () {
    var self = this;
    Topic.new(self.context.user, function (err, topic) {
        if (err) {
            return self.context.error(err);
        }
        self.context.redirect("/topic/edit/" + topic.id);
    });
};

TopicEditController.prototype.index = function () {
    var self = this;
    Topic.get(self.topicId, function (err, topic) {
        if (err) {
            return self.context.error(err);
        }
        self.render("topic-edit.html", {
            topic: topic,
            id: self.topicId,
            types: self.topicTypes
        });
    });
};

TopicEditController.prototype.submit = function () {
    var self = this;
    Topic.get(self.topicId, function (err, topic) {
        if (err) {
            return self.context.error(err);
        }
        topic.datetime = new Date();
        topic.status = Topic.status.PUBLISH;
        topic.title = self.context.data('title');
        topic.content = self.context.data('content');
        topic.type = self.context.data('type');
        topic.save(function (err) {
            if (err) {
                return self.context.error(err);
            }
            self.context.redirect("/topic/" + topic.id);
        });
    });
};