var utils = require("../common/utils");
var mail = require("./mail");
var define = require("./define");
var qn = require("qn");
var fs = require("fs");

/**
 * 定义用户模型
 **/
var User = define.User;

/**
 * 创建一个新用户
 **/
User.create = function () {
    return new User();
};

/**
 * 加载按积分降序排序的 n 个用户
 **/
User.getList = function (top, callback) {
    var self = User;
    self.find({
        "verifyCode": ""
    }).sort({
        'score': -1,
        '_id': 1
    }).limit(top).exec(callback);
};

/**
 * 登录一个用户
 **/
User.signIn = function (user, callback) {
    var self = User;
    if (!user.email || !user.password) {
        return callback("账号或者密码错误");
    }
    self.findOne({
        "email": new RegExp(user.email, "igm"),
        "password": utils.hashDigest(user.password)
    }, function (err, foundUser) {
        if (err) {
            return callback(err, user);
        }
        if (foundUser && foundUser.verifyCode) {
            return callback("该账号的邮箱还未验证，请完成验证或重新注册", user);
        } else if (foundUser) {
            return callback(null, foundUser);
        } else {
            return callback('账号或者密码错误', user);
        }
    });
};

/**
 * 通过 oauth 认证一个用户
 **/
User.oAuth = function (user, callback) {
    var self = User;
    if (!user || !user.email) {
        return callback('oAuth 发生了异常，没有可用 email');
    }
    self.findOne({
        "email": user.email
    }, function (err, foundUser) {
        if (err) {
            return callback(err);
        }
        if (foundUser) {
            foundUser.verifyCode = "";
            foundUser.save(function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, foundUser);
            });
        } else {
            user.avatar = user.avatar || self.getRandomAvatar();
            user.save(function (err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, user);
            });
        }
    });
};

/**
 * 根据一个字段检查是否存在用户
 **/
User.existsByField = function (field, value, callback) {
    var self = this;
    var options = {};
    options[field] = new RegExp(value, "igm");
    self.findOne(options, function (err, foundUser) {
        if (err) {
            return callback(err);
        }
        return callback(null, foundUser);
    });
};

/**
 * 根据 email 清除未验证的用户
 **/
User.clearNotVerifiedByEmail = function (email, callback) {
    var self = this;
    self.remove({
        "email": email,
        "verifyCode": { $ne: "" }
    }, callback);
};

/**
 * 检查 email 或 name 是否存在
 **/
User.checkEmailOrName = function (user, callback) {
    var self = this;
    self.clearNotVerifiedByEmail(user.email, function () {
        self.existsByField("email", user.email, function (err, existsUser) {
            if (err) {
                return callback(err);
            }
            if (existsUser) {
                return callback('邮箱 "' + user.email + '" 已经被使用');
            }
            self.existsByField("name", user.name, function (err, existsUser) {
                if (err) {
                    return callback(err);
                }
                if (existsUser) {
                    return callback('名字 "' + user.name + '" 已经被使用');
                } else {
                    return callback();
                }
            });
        });
    });
};

/**
 * 注册一个用户
 **/
User.signUp = function (user, callback) {
    var self = this;
    user.avatar = user.avatar || self.getRandomAvatar();
    if (!user.email || user.email.indexOf('@') < 0) {
        return callback("请填写正确的邮箱");
    }
    if (!user.name || user.name.length < 2) {
        return callback("名字最少需要两个字符");
    }
    if (!user.password || user.password.length < 6) {
        return callback('密码最少需要六个字符');
    }
    self.checkEmailOrName(user, function (err) {
        if (err) {
            return callback(err);
        }
        user.password = utils.hashDigest(user.password);
        user.verifyCode = utils.newGuid();
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
};

/**
 * 随机生成一个用户头像 URL
 **/
User.getRandomAvatar = function () {
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
 * 通过名称获取用户
 **/
User.getUserByName = function (name, callback) {
    var self = this;
    self.findOne({ "name": new RegExp(name, "igm") }, callback);
};

/**
 * 搜索匹配的人员
 **/
User.search = function (keyword, callback) {
    var self = this;
    self.find({
        "verifyCode": "",
        "name": {
            $regex: keyword,
            $options: 'i'
        }
    }).sort({
        'score': -1,
        '_id': 1
    }).limit(10).exec(callback);
};

/**
 * 验证邮箱
 **/
User.verifyMail = function (verifyCode, callback) {
    var self = this;
    self.findOne({
        "verifyCode": verifyCode
    }, function (err, foundUser) {
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

/**
 * 设置用户的密码
 **/
User.setPassword = function (opts, callback) {
    var self = this;
    if (!opts.password || opts.password.length < 6) {
        return callback('密码最少需要六个字符');
    }
    self.updateUser(opts.id, { password: utils.hashDigest(opts.password) }, callback);
};

/**
 * 初始化 QiQiu Client
 **/
User._initQiQiu = function () {
    var self = this;
    if (!self.quClient) {
        var qnConfigs = utils.configs.qiniu;
        self.quClient = qn.create({
            accessKey: qnConfigs.accessKey,
            secretKey: qnConfigs.secretKey,
            bucket: qnConfigs.bucket,
            origin: qnConfigs.origin
        });
    }
};

/**
 * 根据 URL 获取头像文件名
 **/
User._getAvatarFileName = function (avatarUrl) {
    avatarUrl = avatarUrl || "";
    return avatarUrl.split('?')[0].split('/').pop();
};

/**
 * 上传用户头像到 QiQiu
 **/
User._uploadAvatar = function (baseInfo, callback) {
    var self = this;
    var newFileKey = "avatar-" + baseInfo.id + "-" + Date.now();
    self.quClient.upload(fs.createReadStream(baseInfo.avatar), {
        key: newFileKey
    }, function (err, result) {
        if (err) {
            return callback(err);
        }
        baseInfo.avatar = self.quClient.imageView(newFileKey, {
            mode: 1,
            width: 160,
            height: 160,
            q: 50,
            format: 'png'
        });
        var oldFileKey = self._getAvatarFileName(baseInfo.oldAvatar);
        self.quClient.delete(oldFileKey, function (err) {
            callback(null, baseInfo);
        });
    });
};

/**
 * 根据 ID 更新用户的某几个字段
 **/
User.updateUser = function (id, obj, callback) {
    var self = this;
    self.update({ "_id": id }, { $set: obj }, callback);
};

/**
 * 保存用户基本信息
 **/
User.saveBaseInfo = function (baseInfo, callback) {
    var self = this;
    if (!baseInfo.name || baseInfo.name.length < 2) {
        return callback("名字最少需要两个字符");
    }
    self._initQiQiu();
    self.existsByField("name", baseInfo.name, function (err, existsUser) {
        if (err) {
            return callback(err);
        }
        if (existsUser && existsUser._id != baseInfo.id) {
            return callback('名字 "' + baseInfo.name + '" 已经被使用');
        }
        if (!baseInfo.avatar) {
            return self.updateUser(baseInfo.id, {
                name: baseInfo.name
            }, function (err) {
                callback(err, baseInfo);
            });
        }
        self._uploadAvatar(baseInfo, function (err, info) {
            self.updateUser(info.id, {
                name: info.name,
                avatar: info.avatar
            }, function (err) {
                callback(err, info);
            });
        });
    });
};

module.exports = User;