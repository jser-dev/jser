/* global nokit */
var Task = nokit.Task;
var User = require("../models/user");
var Topic = require("../models/topic");

/**
 * 活动控制器
 **/
var SearchController = function () { };

/**
 * 默认 action
 **/
SearchController.prototype.index = function () {
    var self = this;
    self.keyword = self.context.params('keyword');
    var task = Task.create();
    task.add(function (done) {
        User.search(self.keyword, function (err, userList) {
            if (err) {
                return self.context.error(err);
            }
            self.userList = userList;
            done();
        });
    });
    task.add(function (done) {
        Topic.search(self.keyword, function (err, topicList) {
            if (err) {
                return self.context.error(err);
            }
            self.topicList = topicList;
            done();
        });
    });
    task.end(function () {
        self.render("search.html", self);
    });
};

module.exports = SearchController;