"use strict";

var User = require('../models/user');

var ProfileController = module.exports = function () { };

ProfileController.prototype.index = function () {
    var self = this;
    self.render("profile.html", {
        user: self.context.user
    });
};

ProfileController.prototype.signout = function () {
    var self = this;
    self.context.session.user = null;
    self.context.redirect("/");
};