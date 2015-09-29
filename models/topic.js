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

Topic.loadTypes = function (callback) {
    var self = Topic;
    callback([
        {
            text: "精华",
            name: "jh",
            admin: true,
        },
        {
            text: "分享",
            name: "share"
        },
        {
            text: "问答",
            name: "qa"
        },
        {
            text: "活动",
            name: "active"
        }
    ]);
};