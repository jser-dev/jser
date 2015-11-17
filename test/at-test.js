var atRegExp = new RegExp("\\@\\w+\\s+", "igm");

var rs = "@houfeng @li ".replace(atRegExp, function (str) {
	console.log("item: " + str);
	return "[" + str + "]";
});
console.log("rs: " + rs);