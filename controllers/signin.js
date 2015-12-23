var utils = require('../common/utils');
var User = require('../models/user');

var SignInController = module.exports = function () { };

SignInController.prototype.index = function () {
    var self = this;
    //记录进入登录页之前的页面
    var referer = self.request.headers["referer"];
    if (referer &&
        referer.indexOf("/signin") < 0 &&
        referer.indexOf("/oauth") < 0) {
        self.session.set("referer", referer);
    } if (referer && referer.indexOf("/signup") > -1) {
        self.session.set("referer", "/");
    }
    self.render("signin.html");
};

SignInController.prototype.submit = function () {
    var self = this;
    var userInfo = self.getUserInfo();
    User.signIn(userInfo, function (err, user) {
        if (err) {
            self.render("signin.html", {
                status: !err,
                message: err,
                user: userInfo
            });
        } else {
            self.session.set("user", user, function () {
                self.session.get("referer", function (referer) {
                    self.context.redirect(referer || "/");
                });
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