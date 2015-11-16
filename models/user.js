var utils = require("../common/utils");
var mail = require("./mail");
var define = require("./define");

//定义用户模型
var User = define.User;

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
    self.findOne({ 
        "email": user.email, 
        "password": user.password }, 
    function (err, foundUser) {
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

//根据一个字段检查是否存在用户
User.existsByField=function(field,value,callback){
    var options={};
    options[field]=value;
    self.findOne(options, function (err, foundUser) {
        if (err) {
            return callback(err);
        }
        return callback(null, foundUser);
    });
};

//注册一个用户
User.signUp = function (user, callback) {
    var self = this;
    user.avatar = user.avatar || self.getAvatar();
    if (!user.email || user.email.indexOf('@') < 0) {
        return callback("请填写正确的邮箱");
    }
    if (!user.name || user.name.length < 2) {
        return callback("名字最少需要两个字符");
    }
    if (!user.password || user.password.length < 6) {
        return callback('密码最少需要六个字符');
    }
    self.existsByField("email",user.email,function(err,existsUser){
       if(err){
           return callback(err);
       } 
       if(existsUser){
           return callback('邮箱 "'+user.email+'" 已经被使用');
       }
        self.existsByField("name",user.name,function(err,existsUser){
            if(err){
                return callback(err);
            } 
            if(existsUser){
                return callback('名字 "'+user.email+'" 已经被使用');
            }
            user.verifyCode = utils.newGuid();
            user.password = utils.hashDigest(user.password);
            user.save(function (err) {
                if (err) {
                    return callback(err);
                }
                mail.sendForReg(user, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, user);
                });
            });
        });
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

/**
 * 验证邮箱
 **/
User.verifyMail = function (verifyCode, callback) {
    var self = this;
    self.findOne({ "verifyCode": verifyCode }, function (err, foundUser) {
        if (err) {
            return callback(err);
        }
        if (foundUser) {
            foundUser.verifyCode = '';
            foundUser.save(function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, foundUser);
            });
        } else {
            return callback(null, null);
        }
    });
};


module.exports = User;