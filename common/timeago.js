/* global nokit */
var timeago = require('timeago-words');
var utils = require('./utils.js');

//时间显示模块
module.exports.init = function () {
	timeago.settings.suffixAgo = '';
	timeago.settings.suffixFromNow = '距现在';
	timeago.settings.seconds = "刚刚";
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

	/**
	 * 将 timeago 挂在 utils 上 (utils 的为引用为 nokit.utils 参考 common/utils.js)
	 * utils 可以在模板中通过 $ 调用
	 **/
	nokit.utils.timeago = function (dt) {
		return timeago(dt);
	};
};
