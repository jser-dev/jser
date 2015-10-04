var timeago = require('timeago-words');
// module.exports.settings = {
//   allowFuture: false,
//   prefixAgo: null,
//   prefixFromNow: null,
//   numbers: [],
//   suffixAgo: "ago",
//   suffixFromNow: "from now",
//   seconds: "less than a minute",
//   minute: "about a minute",
//   minutes: "%d minutes",
//   hour: "about an hour",
//   hours: "about %d hours",
//   day: "a day",
//   days: "%d days",
//   month: "about a month",
//   months: "%d months",
//   year: "about a year",
//   years: "%d years"
// };
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

console.log(timeago(new Date()));