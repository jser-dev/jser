"use strict";

var db = require("../common/db");
var User = require("./user");

//定义话题模型
var Comment = module.exports = db.model('comment', {
    content: String, //内容
    author: { type: db.types.ObjectId, ref: 'User' }, //作者
    datetime: Date, //时间
    like: Number, //“赞” 的数量 
    dislike: Number, //"踩" 的数量
    status: Number,// 状态,
});
