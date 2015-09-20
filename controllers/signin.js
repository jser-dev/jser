"use strict";

var User = require('../models/user');

var SignInController = module.exports = function () { };

SignInController.prototype.index = function () {
    var self = this;
    self.render("signin.html");
};

SignInController.prototype.submit = function () {
    var self = this;
    var user = self._newUser();
    User.signIn(user, function (result) {
        if (result.status) {
            self.context.redirect("/");
        }
        self.render("signin.html", result);
    });
};

//通过浏览器 post 过来的数据创建一个 “User”
SignInController.prototype._newUser = function () {
    var self = this;
    var user = User.create();
    var req = self.context.request;
    user.email = req.body.email;
    user.password = req.body.password;
    return user;
};