var User = require('../models/user');

var SignUpController = module.exports = function () { };

SignUpController.prototype.index = function () {
    var self = this;
    self.render("signup.html", {
        data: {}
    });
};

SignUpController.prototype.submit = function () {
    var self = this;
    var user = self._newUser();
    if (!self._checkUser(user)) {
        return self._submitFail("注册失败");
    }
    user.save(function (err) {
        if (err) {
            self._submitFail("注册失败");
        } else {
            self._submitSuccess("注册成功");
        }
    });
};

SignUpController.prototype._newUser = function () {
    var self = this;
    var user = new User();
    var req = self.context.request;
    user.account = req.body.account;
    user.email = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;
    user.avatar = req.body.avatar;
    return user;
};

SignUpController.prototype._checkUser = function (user) {
    var self = this;
    return user.account && user.email && user.password;
};

SignUpController.prototype._submitFail = function (message) {
    var self = this;
    var req = self.context.request;
    self.render('signup.html', {
        status: false,
        message: message,
        data: req.body
    });
};

SignUpController.prototype._submitSuccess = function (message) {
    var self = this;
    self.render('signup.html', {
        status: true,
        message: message
    });
};