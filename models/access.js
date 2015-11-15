var define = require('./define');
var status = require("./status").comment;

//定义话题模型
var Access = define.Access;

Access.read = function (callback) {
	var self = this;
	self.find(null, callback);
};

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