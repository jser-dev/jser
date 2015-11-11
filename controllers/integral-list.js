var User = require("../models/user");

/**
 * 活动控制器
 **/
var IntegralListController = function () { };

/**
 * 默认 action
 **/
IntegralListController.prototype.index = function () {
    var self = this;
    self.top = 100;
    User.getList(self.top, function (err, userList) {
        if (err) {
            return self.context.error(err);
        }
        self.topUserList = userList;
        self.render("integral-list.html", self);
    });
};

module.exports = IntegralListController;