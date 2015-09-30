"use strict";

var db = require("../common/db");

//定义话题模型
var Topic = module.exports = db.model('topic', {
    title: String, //标题
    content: String, //内容
    type: Array, //类型
    author: Object, //作者
    datetime: Date, //时间
    comments: Array, //评论
    like: Number, //“赞” 的数量 
    dislike: Number, //"踩" 的数量
    status: Number,// 状态,
    tags: Array //标签
});

//话题状态
Topic.status = {
    DRAFT: 0,
    PUBLISH: 1
};


//加载所有话题
Topic.load = function (callback) {
    var self = Topic;
    self.find({}, callback);
};

//加载所有话题类型
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