"use strict";

var db = require("../common/db");
var User = require("./user");
var Comment = require('./comment');

//定义话题模型
var Topic = module.exports = db.model('Topic', {
    title: { type: String, default: '' }, //标题
    content: { type: String, default: '' }, //内容
    type: [{ type: String, default: '' }], //类型
    author: { type: db.types.ObjectId, ref: User.schema.name }, //作者
    tags: [{ type: String, default: '' }], //标签,
    createAt: { type: Date, default: Date.now }, //创建时间
    updateAt: { type: Date, default: Date.now }, //更新时间
    comments: [{ type: db.types.ObjectId, ref: Comment.schema.name, default: [] }], //评论
    like: { type: Number, default: 0 }, //“赞” 的数量 
    dislike: { type: Number, default: 0 }, //"踩" 的数量
    top: { type: Number, default: 0 }, //置顶, 0: 不置顶，>0: 置顶（值为置顶权重）
    read: { type: Number, default: 0 }, //阅读数量
    replay: { type: Number, default: 0 }, //回复数量
    lastReplayAt: { type: Date, default: Date.now }, //最后回复时间
    status: { type: Number, default: 0 }// 状态,
});

//话题状态
Topic.status = {
    DELETE: -1,
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
    self.findById(id)
        .populate('author')
        .populate('comments')
        .exec(callback);
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
        .populate('comments')
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