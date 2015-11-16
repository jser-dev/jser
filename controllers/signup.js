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
    var userInfo = self.getUserInfo();
    User.signUp(userInfo, function (err, user) {
        self.render('signup.html', {
            status: !err,
            message: err || "注册成功",
            user: user || userInfo
        });
    });
};

//通过浏览器 post 过来的数据创建一个 “User”
SignUpController.prototype.getUserInfo = function () {
    var self = this;
    var user = User.create();
    var req = self.context.request;
    user.email = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;
    return user;
};