"use strict";

var db = require("../common/db");
var utils = require("../common/utils");

//定义用户模型
var User = module.exports = db.model('User', {
    email: { type: String, unique: true }, // email
    password: { type: String, default: '' }, //密码
    name: { type: String, unique: true }, //名字
    avatar: { type: String, default: '' }, //头像 
    integral: { type: Number, default: 0 }, //积分,
    signUpAt: { type: Date, default: Date.now },//注册时间
    role: [{ type: String, default: '' }]
}); 

//创建一个新用户
User.create = function () {
    return new User();
};

//加载所有用户
User.getList = function (top, callback) {
    var self = User;
    self.find({})
        .sort({ 'integral': -1, '_id': 1 })
        .limit(top)
        .exec(callback);
};

//登录一个用户
User.signIn = function (user, callback) {
    var self = User;
    if (user.email == '' || user.password == '') {
        return callback("用户或者密码错误");
    }
    user.password = utils.hashDigest(user.password);
    self.findOne({ "email": user.email, "password": user.password }, function (err, foundUser) {
        if (err) {
            return callback(err);
        }
        if (foundUser) {
            return callback(null, foundUser);
        } else {
            return callback('用户或者密码错误');
        }
    });
};

//通过 oauth 认证一个用户
User.oAuth = function (user, callback) {
    var self = User;
    if (user.email == '') {
        return callback('oAuth 发生了异常，没有可用 email');
    }
    self.findOne({ "email": user.email }, function (err, foundUser) {
        if (err) {
            return callback(err);
        }
        if (foundUser) {
            return callback(null, foundUser);
        } else {
            user.avatar = user.avatar || self.getAvatar();
            user.save(function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, user);
            });
        }
    });
};

//注册一个用户
User.signUp = function (user, callback) {
    var self = this;
    user.avatar = user.avatar || self.getAvatar();
    if (user.email == '' || user.name == '' || user.password == '') {
        return callback('用户信息不合法');
    }
    user.password = utils.hashDigest(user.password);
    user.save(function (err) {
        if (err) {
            return callback(err);
        }
        return callback(null, user);
    });
};

User.getAvatar = function () {
    var index = utils.random(1, 12);
    return "/images/avatar/" + index + ".png";
}