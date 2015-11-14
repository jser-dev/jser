var User = require("../models/user");

/**
 * 积分榜控制器
 **/
var UserTopController = function () { };

/**
 * 默认 action
 **/
UserTopController.prototype.index = function () {
    var self = this;
    self.top = 100;
    User.getList(self.top, function (err, userList) {
        if (err) {
            return self.context.error(err);
        }
        self.topUserList = userList;
        self.render("user-top.html", self);
    });
};

module.exports = UserTopController;