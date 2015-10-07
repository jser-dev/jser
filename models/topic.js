"use strict";

var Task = nokit.Task;
var define = require('./define');
var status = require('./status');
var Comment = require('./comment');

//定义话题模型
var Topic = module.exports = define.Topic;
//数据验证

Topic.TITLE_MIN_LENGTH = 10;
Topic.schema.path('title').validate(function (value) {
    return value && value.length >= Topic.TITLE_MIN_LENGTH;
}, '标题不能少于 ' + Topic.TITLE_MIN_LENGTH + ' 个字符');

//新建一个 topic
Topic.new = function (author, callback) {
    var self = Topic;
    self.findOne({ status: status.DRAFT }, function (err, foundTopic) {
        if (err) {
            return callback(err);
        }
        if (foundTopic) {
            return callback(null, foundTopic);
        }
        var topic = new Topic();
        topic.author = author;
        topic.status = status.DRAFT;
        topic.datetime = new Date();
        topic.save(callback);
    });
};

//获取一个 topic
Topic.get = function (id, callback) {
    var self = Topic;
    var task = new Task();
    task.add('topic', function (done) {
        self.findById(id)
            .populate('author')
            .populate('lastReplayAuthor')
            .exec(function (err, topic) {
                if (err) {
                    callback(err);
                } else {
                    done(topic);
                }
            });
    });
    task.add('comments', function (done) {
        Comment.getListByTopicId(id, function (err, comments) {
            if (err) {
                callback(err);
            } else {
                done(comments);
            }
        })
    });
    task.end(function (rs) {
        var topic = rs.topic;
        topic.comments = rs.comments;
        callback(null, topic);
    });
};

Topic.PAGE_SITE = 20;

Topic._options2Where = function (options) {
    var self = Topic;
    var where = (!options.type || options.type == 'all') ?
        {
            status: options.status || status.PUBLISH
        } : {
            status: options.status || status.PUBLISH,
            type: options.type
        };
    return where;
};

//加载所有话题
Topic.getList = function (options, callback) {
    var self = Topic;
    options = options || {};
    var where = self._options2Where(options);
    self.find(where)
        .sort({ 'top': -1, '_id': -1 })
        .skip(options.pageSize * (options.pageIndex - 1))
        .limit(options.pageSize)
        .populate('author')
        .populate('lastReplayAuthor')
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