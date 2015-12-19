var AccessFilter = function () { };

//已登录
AccessFilter.SIGNED = 'signed';

AccessFilter.prototype.onMvcHandle = function (context, next) {
	var self = this;
	context.session.get("user", function (user) {
		context.user = user;
		if (user) {
			//检查是不是超极管理员
			context.user.isAdmin = context.configs.adminUser.some(function (item) {
				return item == user.email;
			});
		}
		if (!context.user && self.requiredHas(context, AccessFilter.SIGNED)) {
			context.redirect('/signin');
		} else {
			next();
		}
	});
};

AccessFilter.prototype.requiredHas = function (context, name) {
	return context.route &&
		context.route.required &&
		context.route.required.some(function (item) {
			return item == name;
		});
};

module.exports = AccessFilter;