var utils = require("../common/utils");
var define = require("./define");

//定义用户模型
var User = define.User;

//数据验证
User.PWD_MIN_LENGTH = 6;
User.schema.path('password').validate(function (value) {
    return value && value.length >= User.PWD_MIN_LENGTH;
}, '密码不能少于 ' + User.PWD_MIN_LENGTH + ' 个字符');

//创建一个新用户
User.create = function () {
    return new User();
};

//加载按积分降序排序的 n 个用户
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
    if (!user.email || !user.password) {
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
    if (!user || !user.email) {
        return callback('oAuth 发生了异常，没有可用 email');
    }
    user.avatar = user.avatar || self.getAvatar();
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
    if (!user.email ||
        !user.name ||
        !user.password ||
        user.password.length < User.PWD_MIN_LENGTH) {
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

//生成一个用户头像
User.getAvatar = function () {
    var index = utils.random(1, 12);
    return "/images/avatar/" + index + ".png";
};

/**
 * 获取一个用户
 **/
User.getUser = function (id, callback) {
    var self = this;
    self.findById(id, callback);
};

/**
 * 搜索匹配的人员
 **/
User.search = function (keyword, callback) {
    var self = this;
    self.find({ "name": { $regex: keyword, $options: 'i' } })
        .sort({ 'integral': -1, '_id': 1 })
        .limit(10)
        .exec(callback);
};

module.exports = User;