"use strict";

var db = require("../common/db");
var User = require("./user");
var Comment = require('./comment');

//定义话题模型
var Topic = module.exports = db.model('topic', {
    title: String, //标题
    content: String, //内容
    type: [String], //类型
    author: { type: db.types.ObjectId, ref: User.schema.name }, //作者
    datetime: { type: Date, default: Date.now }, //时间
    comments: [{ type: db.types.ObjectId, ref: Comment.schema.name, default: [] }], //评论
    like: { type: Number, default: 0 }, //“赞” 的数量 
    dislike: { type: Number, default: 0 }, //"踩" 的数量
    status: { type: Number, default: 0 },// 状态,
    tags: [String], //标签,
    top: { type: Number, default: 0 }, //置顶,
    read: { type: Number, default: 0 }
});

//话题状态
Topic.status = {
    DRAFT: 0,
    PUBLISH: 1
};


Topic.new = function (author, callback) {
    var self = Topic;
    self.findOne({ status: self.status.DRAFT }, function (err, foundTopic) {
        if (err) {
            return callback(err);
        }
        if (foundTopic) {
            return callback(null, foundTopic);
        }
        var topic = new Topic();
        topic.author = author;
        topic.status = self.status.DRAFT;
        topic.datetime = new Date();
        topic.save(callback);
    });
};

Topic.get = function (id, callback) {
    var self = Topic;
    self.findById(id, callback);
}

Topic.PAGE_SITE = 20;

Topic._options2Where = function (options) {
    var self = Topic;
    var where = (!options.type || options.type == 'all') ?
        {
            status: options.status || self.status.PUBLISH
        } : {
            status: options.status || self.status.PUBLISH,
            type: options.type
        };
    return where;
}

//加载所有话题
Topic.getList = function (options, callback) {
    var self = Topic;
    var where = self._options2Where(options);
    self.find(where)
        .sort({ 'top': -1, '_id': -1 })
        .skip(options.pageSize * (options.pageIndex - 1))
        .limit(options.pageSize)
        .populate('author')
        .exec(callback);
};

Topic.getCount = function (options, callback) {
    var self = Topic;
    var where = self._options2Where(options);
    self.count(where, callback);
};

//加载所有话题类型
Topic.loadTypes = function (callback) {
    var self = Topic;
    callback(null, [
        {
            text: "精华",
            name: "essence",
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