/* global nokit */
var Task = nokit.Task;
var define = require('./define');
var status = require('./status');
var Comment = require('./comment');

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
    self.findOne({ "status": status.DRAFT, "author": author.id }, function (err, foundTopic) {
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

Topic._options2Where = function (options) {
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

Topic.getLastByAuthor = function (options, callback) {
    var self = Topic;
    var where = self._options2Where(options);
    where.author = options.author;
    self.find(where).sort({ 'top': -1, '_id': -1 })
        .skip(0)
        .limit(10)
        .populate('author')
        .populate('lastReplayAuthor')
        .exec(callback);
};

//加载所有话题类型
Topic.loadTypes = function (callback) {
    callback(null, [
        {
            text: "精华",
            name: "good",
            admin: true,
        },
        {
            text: "问答",
            name: "ask"
        },
        {
            text: "分享",
            name: "share"
        },
        {
            text: "活动",
            name: "event"
        },
        {
            text: "招聘",
            name: "job"
        }
    ]);
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