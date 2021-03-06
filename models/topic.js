/* global nokit */
var Task = nokit.Task;
var define = require('./define');
var Comment = require('./comment');
var status = require('./status').topic;
var score = require('./score');
var utils = require('../common/utils');

//定义话题模型
var Topic = module.exports = define.Topic;

//新建一个 topic
Topic.new = function (author, callback) {
    var self = Topic;
    self.findOne({
        "status": status.DRAFT,
        "author": author._id
    }, function (err, foundTopic) {
        if (err) {
            return callback(err);
        }
        if (foundTopic) {
            return callback(null, foundTopic);
        }
        var topic = new Topic();
        topic.title = "";
        topic.content = "";
        topic.author = author._id;
        topic.status = status.DRAFT;
        topic.datetime = new Date();
        topic.save(callback);
        score.add(author._id, "topic-add");
    });
};

//保存一个话题
Topic.save = function (topic, callback) {
    if (!topic.title || topic.title.length < 10) {
        return callback("话题标题不能少于 10 个字");
    }
    if (!topic.content || topic.content.length < 1) {
        return callback("话题内容不能少于 1 个字");
    }
    if (!topic.type || topic.type.length < 1) {
        return callback("请选择话题类型");
    }
    topic.html = utils.md2html(topic.content);
    topic.createAt = topic.createAt || new Date();
    topic.updateAt = new Date();
    topic.lastReplayAt = topic.lastReplayAt || new Date();
    topic.save(callback);
};

//获取一个 topic
Topic.get = function (id, callback) {
    var self = Topic;
    var task = new Task();
    task.add('topic', function (done) {
        self.findById(id)
            .populate('author')
            .populate('lastReplayAuthor')
            .exec(done);
    });
    task.add('comments', function (done) {
        Comment.getListByTopicId(id, done);
    });
    task.end(function (err, rs) {
        if (err && err.name == "CastError") {
            return callback();
        } else if (err) {
            return callback(err);
        }
        var topic = rs.topic;
        topic.comments = rs.comments;
        callback(null, topic);
    });
};

//处理查询条件
Topic._handleConditions = function (conditions) {
    conditions = conditions || {};
    conditions.status = conditions.status || status.PUBLISH;
    if (!conditions.type || conditions.type == 'all') {
        delete conditions.type;
    }
    return conditions;
};

//加载所有话题
Topic.getList = function (options, callback) {
    var self = Topic;
    options = options || {};
    options.conditions = self._handleConditions(options.conditions);
    self.find(options.conditions)
        .sort({ 'top': -1, 'lastReplayAt': -1, '_id': -1 })
        .skip(options.pageSize * (options.pageIndex - 1))
        .limit(options.pageSize)
        .populate('author')
        .populate('lastReplayAuthor')
        .exec(callback);
};

/**
 * 获取指定条件的记录数量
 **/
Topic.getCount = function (conditions, callback) {
    var self = Topic;
    conditions = self._handleConditions(conditions);
    self.count(conditions, callback);
};

/**
 * 删除一个话题
 **/
Topic.delete = function (id, callback) {
    var self = this;
    self.findById(id, function (err, item) {
        if (err || !item) {
            return callback(err);
        }
        item.status = status.DELETED;
        item.save(callback);
        Comment.deleteByTopicId(id);//删除对应的评论
        score.add(item.author, "topic-del");
    });

};

/**
 * 设定为精华
 **/
Topic.setGood = function (id, callback) {
    var self = this;
    self.findById(id, function (err, item) {
        if (err || !item) {
            return callback(err);
        }
        item.good = true;
        item.save(callback);
        score.add(item.author, "good-add");
    });
};

/**
 * 移除精华
 **/
Topic.removeGood = function (id, callback) {
    var self = this;
    self.findById(id, function (err, item) {
        if (err || !item) {
            return callback(err);
        }
        item.good = false;
        item.save(callback);
        score.add(item.author, "good-del");
    });
};

/**
 * 设定为精华
 **/
Topic.setTop = function (id, callback) {
    var self = this;
    self.findById(id, function (err, item) {
        if (err || !item) {
            return callback(err);
        }
        item.top = 1;
        item.save(callback);
        score.add(item.author, "top-add");
    });
};

/**
 * 移除精华
 **/
Topic.removeTop = function (id, callback) {
    var self = this;
    self.findById(id, function (err, item) {
        if (err || !item) {
            return callback(err);
        }
        item.top = 0;
        item.save(callback);
        score.add(item.author, "top-del");
    });
};

/**
 * 获取指定用户的最近话题
 **/
Topic.getLastByUserId = function (userId, callback) {
    var self = Topic;
    self.find({
        author: userId,
        status: status.PUBLISH
    }).sort({ 'top': -1, '_id': -1 })
        .skip(0)
        .limit(10)
        .populate('author')
        .populate('lastReplayAuthor')
        .exec(callback);
};

/**
 * 搜索匹配的话题
 **/
Topic.search = function (keyword, callback) {
    var self = this;
    self.find({
        "title": { $regex: keyword, $options: 'i' },
        "status": status.PUBLISH
    }).sort({ '_id': 1 })
        .limit(15)
        .populate('author')
        .populate('lastReplayAuthor')
        .exec(callback);
};

/**
 * 获取草稿列表
 **/
Topic.getDraftList = function (userId, callback) {
    var self = Topic;
    self.find({
        status: status.DRAFT,
        author: userId.toString()
    }).sort({ 'top': -1, '_id': -1 })
        .populate('author')
        .populate('lastReplayAuthor')
        .exec(callback);
};