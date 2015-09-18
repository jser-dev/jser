"use strict";

/**
 * 活动控制器
 **/
var AboutController = module.exports = function () { };

/**
 * 默认 action
 **/
AboutController.prototype.index = function () {
    var self = this;

    self.render("about.html");

};