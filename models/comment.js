"use strict";

var db = require("../common/db");
var User = require("./user");

//定义话题模型
var Comment = module.exports = db.model('comment', {
    content: String, //内容
    author: { type: db.types.ObjectId, ref: 'User' }, //作者
    datetime: { type: Date, default: Date.now }, //时间
    like: { type: Number, default: 0 }, //“赞” 的数量 
    dislike: { type: Number, default: 0 }, //"踩" 的数量
    status: { type: Number, default: 0 }// 状态,
});

//话题状态
Comment.status = {
    DRAFT: 0,
    PUBLISH: 1
};