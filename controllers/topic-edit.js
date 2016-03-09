var Topic = require('../models/topic');
var status = require('../models/status').topic;

/**
 * 话是控制器
 **/
var TopicEditController = module.exports = function () { };

TopicEditController.prototype.init = function () {
    var self = this;
    self.topicId = self.context.param('id');
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
            "topic": topic,
            "id": self.topicId,
            "types": self.topicTypes
        });
    });
};

TopicEditController.prototype.submit = function () {
    var self = this;
    Topic.get(self.topicId, function (err, topic) {
        if (err) {
            return self.context.error(err);
        }
        if (self.context.param("publish")) {
            topic.status = status.PUBLISH;
        } else {
            topic.status = status.DRAFT;
        }
        topic.title = self.context.param('title');
        topic.content = self.context.param('content');
        topic.type = self.context.param('type');
        Topic.save(topic, function (err) {
            if (!err && topic.status == status.PUBLISH) {
                return self.context.redirect("/topic/" + topic.id);
            }
            self.render("topic-edit.html", {
                "saveMessage": err || "保存成功",
                "topic": topic,
                "id": self.topicId,
                "types": self.topicTypes
            });
        });
    });
};