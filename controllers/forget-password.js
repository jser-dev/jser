"use strict";

/**
 * 活动控制器
 **/
var ForgetPasswordController = module.exports = function () { };

/**
 * 默认 action
 **/
ForgetPasswordController.prototype.index = function () {
    var self = this;

    self.render("forget-password.html");

};