/* global nokit */
var Message = require("../models/message");
var Task = nokit.Task;

/**
 * 活动控制器
 **/
var MessageController = function () { };

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
        self.render("message.html", self);
    });
};

module.exports = MessageController;