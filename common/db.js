var mg = require("mongoose");

var self = module.exports;

//建立链接
self.connect = function (server, callback) {
	//与数据库建立连接
	mg.connect(server.configs.connStr);
	if (callback) callback();
};

//mongoose 实例
self.mg = mg;

//mongodb 实例
self.types = mg.Schema.Types;

//定义一个模型
self.model = function (name, schemaObject) {
	if (!schemaObject) {
		return mg.model(name);
	} else {
		var schema = new mg.Schema(schemaObject);
		schema.name = name;
		var Model = mg.model(name, schema);
		Model.schema = schema;
		return Model;
	}
};

