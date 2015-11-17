var utils = require("./utils");
var nodemailer = require('nodemailer');

var self = module.exports;
var transporter = null;

/**
 * 发送一封邮件
 **/
self.send = function (options, callback) {
    var mailConfigs = utils.configs.mail;
    if (!transporter) {
        transporter = nodemailer.createTransport(mailConfigs.conn);
    }
    options = options || {};
    options.from = options.from || mailConfigs.from;
    transporter.sendMail(options, callback);
};