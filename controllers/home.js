var Topic = require('../models/topic');
var User = require('../models/user');

/**
 * 主页控制器
 **/
var HomeController = module.exports = function () { };

/**
 * 默认 action
 **/
HomeController.prototype.index = function () {
    var self = this;

    Topic.load(function (err, list) {
        if (err) {
            return self.context.error(err);
        }
        self.render("home.html", {
            list: list
        });
    });

};