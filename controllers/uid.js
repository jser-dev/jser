var User = require("../models/user");

/**
 * UIDController
 **/
var UIDController = function () { };

/**
 * 初始化
 **/
UIDController.prototype.init = function () {
    var self = this;
    self.ready();
}

/**
 * 默认 action
 **/
UIDController.prototype.index = function () {
    var self = this;
    var userId = self.context.params("id");
    User.getUser(userId, function (err, user) {
        if (err) {
            return self.context.error(err);
        }
        if (!user) {
            return self.context.notFound();
        }
        self.context.redirect("/user/" + encodeURIComponent(user.name));
    });
}

module.exports = UIDController;