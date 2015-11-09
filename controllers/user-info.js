var User = require('../models/user');

/**
 * 活动控制器
 **/
var UserInfoController = function () { };

/**
 * 默认 action
 **/
UserInfoController.prototype.index = function () {
    var self = this;
    var userId = self.context.data("userId");
    User.getUser(userId, function (err, user) {
        if (err) {
            return this.context.error(err);
        }
        self.render("user-info.html", {
            user: user
        });
    });
};

module.exports = UserInfoController;