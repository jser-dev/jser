var User = require('../models/user');

var SignInController = module.exports = function () { };

SignInController.prototype.index = function () {
    var self = this;
    self.render("signin.html", User);
};