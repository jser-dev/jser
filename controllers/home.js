var Topic = require('../models/topic');

var Home = module.exports = function() {};

Home.prototype.index = function() {
    var self = this;
    Topic.testAdd(function() {
        Topic.load(function() {
            self.render("home.html", Topic);
        });
    });
};