var configs = require("../web.json");
var mg = require("mongoose");

// 连接字符串格式为mongodb://主机/数据库名
mg.connect(configs.db);

var self = module.exports;

self.model=function(name,schemaObject){
	var schema =new mg.Schema(schemaObject);
	var Model = mg.model(name, schema);
	return Model;
};