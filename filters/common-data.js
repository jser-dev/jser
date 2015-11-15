var User = require("../models/user");

var CommonDataFilter = function () { };

CommonDataFilter.prototype.onMvcHandle = function (context, next) {
	User.getList(5, function (err, userList) {
		if (err) {
			return context.error(err);
		}
		context.topUserList = userList;
		next();
	});
};

module.exports = CommonDataFilter;