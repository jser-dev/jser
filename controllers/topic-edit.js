var Topic = require('../models/topic');
var status = require('../models/status');
var utils = require('../common/utils');

/**
 * 话是控制器
 **/
var TopicEditController = module.exports = function () { };

TopicEditController.prototype.init = function () {
    var self = this;
    self.topicId = self.context.data('id');
    self.ready();
};

TopicEditController.prototype.new = function () {
    var self = this;
    Topic.new(self.context.user, function (err, topic) {
        if (err) {
            return self.context.error(err);
        }
        self.context.redirect("/topic/" + topic.id + "/edit");
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
        if (topic.status == status.PUBLISH) {
            topic.updateAt = new Date();
        } else {
            topic.createAt = new Date();
            topic.updateAt = topic.createAt;
        }
        topic.status = status.PUBLISH;
        topic.title = self.context.data('title');
        topic.content = self.context.data('content');
        topic.html = utils.md2html(topic.content);
        topic.type = self.context.data('type');
        topic.save(function (err) {
            if (err && err.errors && err.errors.title) {
                return self.context.error(err.errors.title);
            } else if (err) {
                return self.context.error(err);
            }
            self.context.redirect("/topic/" + topic.id);
        });
    });
};