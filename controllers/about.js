/**
 * 关于控制器
 **/
var AboutController = function () { };

/**
 * 默认 action
 **/
AboutController.prototype.index = function () {
    var self = this;

    self.render("about.html");

};

module.exports = AboutController;