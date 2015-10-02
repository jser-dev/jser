"use strict";

/**
 * 活动控制器
 **/
var ControlPanelController = module.exports = function () { };

/**
 * 默认 action
 **/
ControlPanelController.prototype.index = function () {
    var self = this;

    self.render("control-panel.html");

};