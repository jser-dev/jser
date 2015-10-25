"use strict";

/**
 * 客户端页 Controller
 **/
var AboutController = module.exports = function () { };

/**
 * 默认 action
 **/
AboutController.prototype.index = function () {
    var self = this;

    self.render("client.html");

};