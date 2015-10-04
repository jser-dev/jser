"use strict";

var db = require("../common/db");
var status = require('./status');
var User = require('./user');
var Topic = require('./topic');

//定义话题模型
var Comment = module.exports = db.model('Comment', {
    topic: { type: db.types.ObjectId, ref: Topic.schema.name }, //所属话题
    content: { type: String, default: '' }, //内容
    author: { type: db.types.ObjectId, ref: User.schema.name }, //作者
    createAt: { type: Date, default: Date.now }, //创建时间
    updateAt: { type: Date, default: Date.now }, //更新时间
    like: { type: Number, default: 0 }, //“赞” 的数量 
    dislike: { type: Number, default: 0 }, //"踩" 的数量
    status: { type: Number, default: status.PUBLISH }// 状态,
});
