"use strict";

var User = require('../models/user');

//定义 controller
var SignUpController = module.exports = function () { };

//默认 action
SignUpController.prototype.index = function () {
    var self = this;
    self.render("signup.html");
};

//提交注册信息   
SignUpController.prototype.submit = function () {
    var self = this;
    var user = self._newUser();
    User.signUp(user, function (result) {
        self.render('signup.html', result);
    });
};

//通过浏览器 post 过来的数据创建一个 “User”
SignUpController.prototype._newUser = function () {
    var self = this;
    var user = User.create();
    var req = self.context.request;
    user.email = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;
    return user;
};