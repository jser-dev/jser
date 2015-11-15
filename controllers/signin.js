var utils = require('../common/utils');
var User = require('../models/user');

var SignInController = module.exports = function () { };

SignInController.prototype.index = function () {
    var self = this;
    self.render("signin.html");
};

SignInController.prototype.submit = function () {
    var self = this;
    var userInfo = self.getUserInfo();
    User.signIn(userInfo, function (err, user) {
        if (err) {
            self.render("signin.html", {
                status: err == null,
                message: err,
                user: userInfo
            });
        } else {
            self.context.session.set("user", user, function () {
                self.context.redirect("/");
            });
        }
    });
};

//通过浏览器 post 过来的数据创建一个 “User”
SignInController.prototype.getUserInfo = function () {
    var self = this;
    var user = User.create();
    var req = self.context.request;
    user.email = req.body.email;
    user.password = req.body.password;
    return user;
};