/* global nokit */
var crypto = require("crypto");
var Mditor = require('mditor');
var timeago = require('timeago-words');
var status = require("../models/status");

var self = module.exports = (nokit.utils || {});

var HASH_SLOT = "JSER";

/**
 * 产生指定区间的随机数
 **/
self.random = function (begin, end) {
    end += 1; //包含 end
    var range = end - begin;
    var num = Math.random() * range + begin;
    return parseInt(num);
};

/**
 * 对指定字符串进行 sha1 
 **/
self.hashDigest = function (value) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(value);
    sha1.update(HASH_SLOT);
    return sha1.digest('hex');
};

/**
 * 将 timeago 挂在 utils 上 (utils 的为引用为 nokit.utils 参考 common/utils.js)
 * utils 可以在模板中通过 $ 调用
 **/
self.timeago = ((function () {
    timeago.settings.suffixAgo = '';
    timeago.settings.suffixFromNow = '距现在';
    timeago.settings.seconds = "数秒前";
    timeago.settings.minute = "1分钟前";
    timeago.settings.minutes = "%d分钟前";
    timeago.settings.hour = "1小时前";
    timeago.settings.hours = "%d小时前";
    timeago.settings.day = "1天前";
    timeago.settings.days = "%d天前";
    timeago.settings.month = "1月前";
    timeago.settings.months = "%d月前";
    timeago.settings.year = "1年前";
    timeago.settings.years = "%d年前";
    return function (dt) {
        return timeago(dt);
    };
})());

/**
 * 初始化 utils 的一属性
 **/
self.init = function (server) {
    //server
    self.server = server;
    //配置
    self.configs = server.configs;
};

//状态常量
self.status = status;

/**
 * 从文本中提取出@username 标记的用户名数组
 * @param {String} text 文本内容
 * @return {Array} 用户名数组
 */
self.fetchUsers = function (text) {
    if (!text) {
        return [];
    }
    var ignoreRegexs = [
        /```.+?```/g, // 去除单行的 ```
        /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
        /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
        /^    .*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
        /\b\S*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
        /\[@.+?\]\(\/.+?\)/g, // 已经被 link 的 username
    ];

    ignoreRegexs.forEach(function (ignore_regex) {
        text = text.replace(ignore_regex, '');
    });

    var results = text.match(/@[\u4E00-\u9FFF-zA-Z0-9]+/igm);
    var names = [];
    if (results) {
        for (var i = 0, l = results.length; i < l; i++) {
            var s = results[i];
            //remove leading char @
            s = s.slice(1);
            names.push(s);
        }
    }
    //names = _.uniq(names);
    return names;
};

/**
 * 解析 markdown
 **/
self.md2html = function (mdText) {
    if (!mdText) return mdText;
    self._mdParser = self._mdParser || new Mditor.Parser();
    return self._mdParser.parse(mdText);
};