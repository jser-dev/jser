/* global nokit */
var User = require('../models/user');
var Topic = require("../models/topic");
var Comment = require("../models/comment");
var Message = require("../models/message");
var Task = nokit.Task;

/**
 * 活动控制器
 **/
var UserInfoController = function () { };

UserInfoController.prototype.init = function () {
    var self = this;
    self.uname = self.context.data("name");
    User.getUserByName(self.uname, function (err, user) {
        if (err) {
            return self.context.error(err);
        }
        if (!user) {
            return self.context.notFound();
        }
        self.user = user;
        self.userId = user._id;
        self.ready();
    });
};

/**
 * 默认 action
 **/
UserInfoController.prototype.index = function () {
    var self = this;
    var task = Task.create();
    task.add("topicList", function (done) {
        Topic.getLastByUserId(self.userId, done);
    });
    task.add("commentList", function (done) {
        Comment.getLastByUserId(self.userId, done);
    });
    task.add("draftList", function (done) {
        Topic.getDraftList(self.userId, done);
    });
    task.end(function (err, rs) {
        if (err) {
            return self.context.error(err);
        }
        self.topicList = rs.topicList;
        self.commentList = rs.commentList;
        self.draftList = rs.draftList;
        self.render("user-info.html", self);
    });
};

module.exports = UserInfoController;