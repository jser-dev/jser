var User = require('../models/user');

var LoginController = module.exports = function () { };

LoginController.prototype.index = function () {
    var self = this;
    self.render("login.html", User);
};