var User = require('../models/user');

var ProfileController = module.exports = function () { };

//默认 action
ProfileController.prototype.index = function () {
    var self = this;
    self.render("profile.html", {
        user: self.context.user
    });
};

ProfileController.prototype.saveBaseInfo = function () {
    var self = this;
    var name = self.context.data("name");
    var avatar = self.context.request.files["avatar"];
    User.saveBaseInfo({
        "id": self.context.user._id,
        "name": name,
        "avatar": avatar.size > 0 ? avatar.path : null
    }, function (err, info) {
        if (!err && info) {
            self.context.user.name = info.name || self.context.user.name;
            self.context.user.avatar = info.avatar || self.context.user.avatar;
            self.context.session.set("user", self.context.user);
        }
        self.render("profile.html", {
            saveBaseInfoMessage: err || "保存信息完成",
            user: self.context.user
        });
    });
};

ProfileController.prototype.changePassword = function () {
    var self = this;
    var password = self.context.data("password");
    var confirmPassword = self.context.data("confirmPassword");
    if (password != confirmPassword) {
        return self.render("profile.html", {
            changePasswordMessage: "两次密码不一致",
            user: self.context.user
        });
    }
    User.setPassword({
        "id": self.context.user._id,
        "password": password
    }, function (err) {
        self.render("profile.html", {
            changePasswordMessage: err || "修改密码完成",
            user: self.context.user
        });
    });
};

//退出
ProfileController.prototype.signout = function () {
    var self = this;
    self.context.session.remove("user", function () {
        self.context.redirect("/");
    });
};