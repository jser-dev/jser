var Filter = module.exports = function () { };

Filter.prototype.onMvcHandle = function (context, next) {
    context.session.get('user', function (user) {
		context.user = user;
		if (context.route && context.route.admin && !context.user) {
			context.redirect('/signin');
		} else {
			next();
		}
	});
};