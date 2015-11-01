var Filter = module.exports = function () { };

//已登录
Filter.SIGNED = 'signed';

Filter.prototype.onMvcHandle = function (context, next) {
	var self = this;
	context.user = context.session.user;
	if (!context.user && self.requiredHas(context, Filter.SIGNED)) {
		context.redirect('/signin');
	} else {
		next();
	}
};

Filter.prototype.requiredHas = function (context, name) {
	return context.route &&
		context.route.required &&
		context.route.required.some(function (item) {
			return item == name;
		});
};