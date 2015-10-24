"use strict";

/**
 * API 说明页 Controller
 **/
var AboutController = module.exports = function () { };

/**
 * 默认 action
 **/
AboutController.prototype.index = function () {
    var self = this;

    self.render("api.html");

};