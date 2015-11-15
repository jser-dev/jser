var utils = require("../common/utils");
var mail = require("../common/mail");
var tp = nokit.tp;

var self = module.exports;

var tmpls = null;

self.createTmpls = function () {
	if (tmpls == null) {
		tmpls = {};
		tmpls.reg_subject = tp.compile(utils.configs.mail.reg_tmpl.subject);
		tmpls.reg_body = tp.compile(utils.configs.mail.reg_tmpl.body);
		//tmpls.pwd_subject = tp.compile(utils.configs.mail.pwd_tmpl.subject);
		//tmpls.pwd_body = tp.compile(utils.configs.mail.pwd_tmpl.body);
	}
};

self.sendForReg = function (user, callback) {
	self.createTmpls();
	
	var options = {};
	options.from = utils.configs.mail.auth.user; //发件人
	options.to = user.email; //收件人
	options.subject = tmpls.reg_subject();        //主题
	options.html = tmpls.reg_body(user);  //内容
	
	mail.send(options, callback);
};

self.sendForPwd = function (options, callback) {
	
};









