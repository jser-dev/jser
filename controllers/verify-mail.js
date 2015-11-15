var User = require("../models/user");

/**
 * 积分榜控制器
 **/
var VerifyMailController = function () { };

/**
 * 默认 action
 **/
VerifyMailController.prototype.index = function () {
    var self = this;
    var verifyCode = self.context.data("verifyCode");

    User.verifyMail(verifyCode, function (err, user) {
        if (err) {
            return self.context.error(err);
        }
        self.render("verify-mail.html", { "user": user });
    });
};

module.exports = VerifyMailController;