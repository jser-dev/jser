var utils = require("../common/utils");
var self = module.exports;

/**
 * 添加积分
 **/
self.add = function (userId, ruleName, callback) {
    var User = require("./user");
    User.findById(userId, function (err, user) {
        if (err) {
            return callback(err);
        }
        user.score += utils.configs.scoreRules[ruleName];
        user.save(callback);
    });
};