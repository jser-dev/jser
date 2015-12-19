/* global nokit */
var Message = require("../models/message");
var Task = nokit.Task;

/**
 * 活动控制器
 **/
var MessageController = function () { };

/**
 * 初始化 controller
 **/
MessageController.prototype.init = function () {
    var self = this;
    if (!self.context.user) {
        return self.context.forbidden();
    }
    self.ready();
};

/**
 * 默认 action
 **/
MessageController.prototype.index = function () {
    var self = this;
    var userId = self.context.user._id;
    var task = Task.create();
    task.add(function (done) {
        Message.getAllByUserId(userId, function (err, msgList) {
            if (err) {
                return this.context.error(err);
            }
            self.msgList = msgList;
            done();
        });
    });
    task.end(function () {
        self.render("message", self);
    });
};

/**
 * 标记所有为已读
 **/
MessageController.prototype.markAllAsRead = function () {
    var self = this;
    Message.markAllAsReadByUserId(self.context.user._id, function (err) {
        if (err) {
            return self.context.error(err);
        }
        self.context.redirect("/message");
    });
};

/**
 * 清空所有消息
 **/
MessageController.prototype.deleteAll = function () {
    var self = this;
    Message.deleteAllByUserId(self.context.user._id, function (err) {
        if (err) {
            return self.context.error(err);
        }
        self.context.redirect("/message");
    });
};

/**
 * 删除一个消息
 **/
MessageController.prototype.delete = function () {
    var self = this;
    var msgId = self.context.data("msgId");
    Message.deleteById(msgId, function (err) {
        if (err) {
            return self.context.error(err);
        }
        self.context.redirect("/message");
    });
};

/**
 * 打开一个链接
 **/
MessageController.prototype.openLink = function () {
    var self = this;
    var msgId = self.context.data("msgId");
    Message.markAsReadById(msgId, function (err, msg) {
        if (err) {
            return self.context.error(err);
        }
        if (msg && msg.link) {
            self.context.redirect(msg.link);
        } else {
            self.context.redirect("/message");
        }
    });
};

module.exports = MessageController;