var crypto = require("crypto");
var Mditor = require('mditor');

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