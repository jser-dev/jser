var RequiredFilter = function () { };

//已登录
RequiredFilter.SIGNED = 'signed';

RequiredFilter.prototype.onMvcHandle = function (context, next) {
	var self = this;
	context.session.get("user", function (user) {
		context.user = user;
		if (!context.user && self.requiredHas(context, RequiredFilter.SIGNED)) {
			context.redirect('/signin');
		} else {
			next();
		}
	});
};

RequiredFilter.prototype.requiredHas = function (context, name) {
	return context.route &&
		context.route.required &&
		context.route.required.some(function (item) {
			return item == name;
		});
};

module.exports = RequiredFilter;