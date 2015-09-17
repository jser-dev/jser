var User = require('../models/user');

var ProfileController = module.exports = function () { };

ProfileController.prototype.index = function () {
    var self = this;
    self.render("profile.html", {});
};