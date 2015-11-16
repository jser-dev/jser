/* global nokit */
var Task = nokit.Task;
var define = require('./define');
var Comment = require('./comment');
var status = require('./status').topic;

//定义话题模型
var Topic = module.exports = define.Topic;

//数据验证
// Topic.TITLE_MIN_LENGTH = 10;
// Topic.schema.path('title').validate(function (value) {
//     return value && value.length >= Topic.TITLE_MIN_LENGTH;
// }, '标题不能少于 ' + Topic.TITLE_MIN_LENGTH + ' 个字符');

//新建一个 topic
Topic.new = function (author, callback) {
    var self = Topic;
    self.findOne({
        "status": status.DRAFT,
        "author": author.id
    }, function (err, foundTopic) {
        if (err) {
            return callback(err);
        }
        if (foundTopic) {
            return callback(null, foundTopic);
        }
        var topic = new Topic();
        topic.title = author.name + '的新话题';
        topic.content = "";
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
        });
    });
    task.end(function (rs) {
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
        .sort({ 'top': -1, '_id': -1 })
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