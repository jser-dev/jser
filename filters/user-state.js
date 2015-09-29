var Filter = module.exports = function () { };

Filter.prototype.onRequestBegin = function (context, next) {
    context.session.get('user', function (user) {
		context.user = user;
		next();
	});
};