/* global nokit */
var Task = nokit.Task;
var Topic = require('../models/topic');

var PAGE_SIZE = 12;

/**
 * 话是控制器
 **/
var TopicListController = module.exports = function () { };

TopicListController.prototype.init = function () {
    var self = this;
    self.currentType = self.context.data('type') || 'all';
    self.pageIndex = self.context.data('pageIndex') || 1;
    //处理查询选项
    self.options = {
        pageSize: PAGE_SIZE,
        pageIndex: self.pageIndex,
    };
    //处理查询条件
    self.options.conditions = {};
    if (self.currentType == 'good') {
        self.options.conditions.good = true;
    } else {
        self.options.conditions.type = self.currentType;
    }
    //创建并行查询任务
    var task = new Task();
    task.add("types", function (done) {
        Topic.loadTypes(function (err, types) {
            if (err) {
                return self.context.error(err);
            }
            done(types);
        });
    });
    task.add("count", function (done) {
        Topic.getCount(self.options.conditions , function (err, count) {
            if (err) {
                return self.context.error(err);
            }
            done(count);
        });
    });
    task.end(function (result) {
        self.types = result["types"];
        self.count = result["count"];
        self.pageCount = parseInt((self.count + (PAGE_SIZE - 1)) / PAGE_SIZE);
        self.pageBegin = self.pageIndex - 2;
        if (self.pageBegin < 1) self.pageBegin = 1;
        self.pageEnd = self.pageBegin + 5;
        if (self.pageEnd > self.pageCount) self.pageEnd = self.pageCount;
        self.ready();
    });
};

/**
 * 默认 action
 **/
TopicListController.prototype.index = function () {
    var self = this;
    Topic.getList(self.options, function (err, list) {
        self.render("topic-list.html", {
            types: self.types,
            currentType: self.currentType,
            pageIndex: self.pageIndex,
            pageBegin: self.pageBegin,
            pageEnd: self.pageEnd,
            pageCount: self.pageCount,
            list: list
        });
    });
};