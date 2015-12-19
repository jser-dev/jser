var define = require('./define');
var status = require("./status").comment;

// 因为当前版本简化了权限管理，暂时用不到此文件

/**
 * 定义权限配置模型
 **/
var Access = define.Access;

/**
 * 读取权限配置
 **/
Access.read = function (callback) {
	var self = this;
	self.find(null, callback);
};

/**
 * 保存权限配置
 **/
Access.save = function (accessList, callback) {
	var self = this;
	self.remove({ id: { $ne: "" } }, function (err) {
		if (err) {
			return callback(err);
		}
		Access.create(accessList, callback);
	});
};

module.exports = Access;