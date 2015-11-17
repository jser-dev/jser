/* global nokit */
var utils = require("../common/utils");
var mail = require("../common/mail");
var tp = nokit.tp;
var fs = require("fs");

var self = module.exports;
var tmpls = null;

self.createTmpls = function () {
	if (!tmpls) {
		var mailConfigs = utils.configs.mail;
		tmpls = {};
		//reg
		tmpls.reg_subject = tp.compile(mailConfigs.reg_tmpl.subject);
		var regBodyPath = utils.server.resolvePath(mailConfigs.reg_tmpl.body);
		var regBody = fs.readFileSync(regBodyPath).toString();
		tmpls.reg_body = tp.compile(regBody);
		//pwd
		tmpls.pwd_subject = tp.compile(mailConfigs.pwd_tmpl.subject);
		var pwdBodyPath = utils.server.resolvePath(mailConfigs.pwd_tmpl.body);
		var pwdBody = fs.readFileSync(pwdBodyPath).toString();
		tmpls.pwd_body = tp.compile(pwdBody);
	}
};

self.sendForReg = function (user, callback) {
	self.createTmpls();
	var options = {};
	options.to = user.email; //收件人
	options.subject = tmpls.reg_subject();        //主题
	options.html = tmpls.reg_body({
		"user": user,
		"configs": utils.configs
	});  //内容
	mail.send(options, callback);
};

self.sendForPwd = function (options, callback) {

};









