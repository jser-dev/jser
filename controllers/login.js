var Login = module.exports = function() {};

Login.prototype.index = function() {
    var self = this;
    self.render("login.html", {});
};