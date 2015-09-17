"use strict";

var db = require("../common/db");

//定义用户模型
var User = module.exports = db.model('user', {
    account: String,
    email: String,
    password: String,
    name: String,
    avatar: String
});

//加载所有用户
User.load = function (callback) {
    var self = User;
    self.find({}, function (err, list) {
        self.list = list;
        if (callback) callback(err, list);
    });
};