"use strict";

var db = require("../common/db");
var User = require("./user");

//定义话题模型
var Comment = module.exports = db.model('Comment', {
    content: { type: String, default: '' }, //内容
    author: { type: db.types.ObjectId, ref: User.schema.name }, //作者
    createAt: { type: Date, default: Date.now }, //创建时间
    updateAt: { type: Date, default: Date.now }, //更新时间
    like: { type: Number, default: 0 }, //“赞” 的数量 
    dislike: { type: Number, default: 0 }, //"踩" 的数量
    status: { type: Number, default: 0 }// 状态,
});

//话题状态
Comment.status = {
    DELETE: -1,
    DRAFT: 0,
    PUBLISH: 1
};