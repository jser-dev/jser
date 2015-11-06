var crypto = require("crypto");
var Mditor = require('mditor');
var timeago = require('timeago-words');
var configs = require('../app.json');

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
 * 解析 markdown
 **/
self.md2html = function (md) {
	if (!md) return md;
	self._mdParser = self._mdParser || new Mditor.Parser();
	return self._mdParser.parse(md);
}

/**
 * 将 timeago 挂在 utils 上 (utils 的为引用为 nokit.utils 参考 common/utils.js)
 * utils 可以在模板中通过 $ 调用
 **/
self.timeago = ((function () {
	timeago.settings.suffixAgo = '';
	timeago.settings.suffixFromNow = '距现在';
	timeago.settings.seconds = "数钞前";
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

//配置
self.configs = configs;