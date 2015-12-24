var define = require('./define');
var status = require("./status").comment;
var utils = require('../common/utils');
var score = require('./score');
var Message = require("./message");
var User = require("./user");

/**
 * 定义评论模型
 **/
var Comment = define.Comment;

/**
 * 根据 topicId 获取评论列表
 **/
Comment.getListByTopicId = function (topicId, callback) {
    var self = Comment;
    self.find({ "topic": topicId, status: status.PUBLISH })
        .sort({ '_id': 1 })
        .populate('author')
        .exec(callback);
};

/**
 * 删除一个话题下的所有评论
 **/
Comment.deleteByTopicId = function (topicId, callback) {
    var self = this;
    self.update({ "topic": topicId }, { $set: { "status": status.DELETED } }, callback);
};

/**
 * 根据 userId 获取用户最近的评论
 **/
Comment.getLastByUserId = function (userId, callback) {
    var self = Comment;
    self.find({
        author: userId,
        status: status.PUBLISH
    }).sort({ '_id': -1 })
        .skip(0)
        .limit(5)
        .populate('author')
        .populate('topic')
        .exec(callback);
};

Comment._sendMessages = function (users, comment) {
    //向话题作者发消息
    Message.send(null, comment.topic.author.name, {
        content: comment._author.name + ' 评论了你的话题 "' + comment.topic.title + '"',
        link: "/topic/" + comment.topic._id + "#" + comment._id
    });
    //向 @ 的人发送消息
    Message.send(null, users, {
        content: comment._author.name + ' 在评论 "' + comment.topic.title + '" 时提到了你',
        link: "/topic/" + comment.topic._id + "#" + comment._id
    });
};

/**
 * 处理 @用户
 **/
Comment._handleUserLinks = function (content, callback) {
    var names = utils.fetchUsers(content);
    User.getUsersByNames(names, function (err, users) {
        if (err) {
            return callback(err);
        }
        users.forEach(function (user) {
            //@[\u4E00-\u9FFFa-zA-Z0-9\-_]+/igm
            content = content.replace(new RegExp('@' + user.name, 'igm'),
                '[@' + user.name + '](/uid/' + user._id + ')');
        });
        callback(null, {
            "content": content,
            "users": names
        });
    });
};

/**
 * 保存一个评论
 **/
Comment.save = function (comment, callback) {
    var self = this;
    if (!comment.content || comment.content.length < 1) {
        return callback("评论内容不能少于 1 个字");
    }
    comment.status = comment.status || status.PUBLISH;
    self._handleUserLinks(comment.content, function (err, rs) {
        if (err) {
            return callback(err);
        }
        comment.html = utils.md2html(rs.content);
        comment.save(function (err) {
            if (err) {
                return callback(err);
            }
            comment.topic.replay++;
            comment.topic.lastReplayAt = comment.updateAt;
            comment.topic.lastReplayAuthor = comment.author;
            comment.topic.save(callback);
            score.add(comment.author._id || comment.author, "comment-add");
            //向相关人员发送消息
            self._sendMessages(rs.users, comment);
        });
    });
};

/**
 * 获取一条评论
 **/
Comment.get = function (commentId, callback) {
    var self = this;
    self.findById(commentId)
        .populate('author')
        .populate('topic')
        .exec(callback);
};

/**
 * 删除一个评论
 **/
Comment.delete = function (commentId, callback) {
    var self = this;
    self.findById(commentId)
        .populate('topic')
        .exec(function (err, comment) {
            if (err) {
                return callback(err);
            }
            //对应贴子回复数 -1
            comment.topic.replay--;
            comment.topic.save();
            //逻辑删除
            comment.status = status.DELETED;
            comment.save(callback);
            //计算用户得分
            score.add(comment.author._id || comment.author, "comment-del");
        });
};

module.exports = Comment;