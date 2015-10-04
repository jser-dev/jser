var Filter = module.exports = function () { };

//已登录
Filter.SIGNED = 'signed';

Filter.prototype.onMvcHandle = function (context, next) {
	var self = this;
	if (!context.route || !context.route.required) {
		return next();
	}
    context.session.get('user', function (user) {
		context.user = user;
		if (!context.user && self.requiredHas(context, Filter.SIGNED)) {
			context.redirect('/signin');
		} else {
			next();
		}
	});
};

Filter.prototype.requiredHas = function (context, name) {
	return context.route &&
		context.route.required &&
		context.route.required.some(function (item) {
			return item == name;
		});
};