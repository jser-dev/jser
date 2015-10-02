var self = module.exports = {};

/**
 * 产生指定区间的随机数
 **/
self.random = function (begin, end) {
	end += 1; //包含 end
	var range = end - begin;
	var num = Math.random() * range + begin;
	return parseInt(num);
}