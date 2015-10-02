"use strict";

/**
 * 活动控制器
 **/
var UserInfoController = module.exports = function () { };

/**
 * 默认 action
 **/
UserInfoController.prototype.index = function () {
    var self = this;

    self.render("user-info.html");

};