"use strict";

var User = require('../models/user');

var ProfileController = module.exports = function () { };

ProfileController.prototype.index = function () {
    var self = this;
    self.render("profile.html", {});
};

ProfileController.prototype.signout = function () {
    var self = this;
    self.context.session.add('user', null, function () {
        self.context.redirect("/");
    });
};