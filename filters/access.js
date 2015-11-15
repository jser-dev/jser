var AccessFilter = function () { };

//已登录
AccessFilter.SIGNED = 'signed';

AccessFilter.prototype.onMvcHandle = function (context, next) {
	var self = this;
	context.session.get("user", function (user) {
		context.user = user;
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