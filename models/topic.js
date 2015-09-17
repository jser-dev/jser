"use strict";

var db = require("../common/db");

//定义话题模型
var Topic = module.exports = db.model('topic', {
    title: String,
    content: String
});

//加载所有话题
Topic.load = function (callback) {
    var self = Topic;
    self.find({}, callback);
};