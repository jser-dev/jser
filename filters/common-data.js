/* global nokit */
var User = require("../models/user");
var Message = require("../models/message");
var Task = nokit.Task;

var CommonDataFilter = function () { };

CommonDataFilter.prototype.onMvcHandle = function (context, next) {
	var task = new Task();
	task.add("topUserList", function (done) {
		User.getList(5, done);
	});
	if (context.user) {
		task.add("unreadMsgList", function (done) {
			Message.getUnreadByUserId(context.user._id, done);
		});
	}
	task.end(function (err, rs) {
		if (err) {
			return context.error(err);
		}
		context.topUserList = rs.topUserList;
		context.unreadMsgCount = rs.unreadMsgList.length;
		next();
	});
};

module.exports = CommonDataFilter;