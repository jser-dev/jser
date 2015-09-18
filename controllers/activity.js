"use strict";

var Activity = require('../models/activity');

/**
 * 活动控制器
 **/
var ActivityController = module.exports = function () { };

/**
 * 默认 action
 **/
ActivityController.prototype.index = function () {
    var self = this;

    self.render("activity.html");

};