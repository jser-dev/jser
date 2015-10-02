"use strict";

/**
 * 活动控制器
 **/
var IntegralListController = module.exports = function () { };

/**
 * 默认 action
 **/
IntegralListController.prototype.index = function () {
    var self = this;

    self.render("integral-list.html");

};