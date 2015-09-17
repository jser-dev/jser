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

    //加载话题数据，并呈现页面
    Topic.load(function (err, list) {
        self.render("home.html", {
            list: list
        });
    });

};