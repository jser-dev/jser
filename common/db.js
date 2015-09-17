var configs = require("../web.json");
var mg = require("mongoose");

//与数据库建立连接
mg.connect(configs.db);

var self = module.exports;

//定义一个模型
self.model = function (name, schemaObject) {
	if (!schemaObject) {
		return mg.model(name);
	} else {
		var schema = new mg.Schema(schemaObject);
		var Model = mg.model(name, schema);
		return Model;
	}
};