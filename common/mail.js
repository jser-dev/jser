var utils = require("./utils");
var nodemailer = require('nodemailer');

var self = module.exports;

var transporter = null;

self.send = function (options, callback) {
    if (!transporter) {
        transporter = nodemailer.createTransport(utils.configs.mail.conn);
    }
    options = options || {};
    options.from = utils.configs.mail.conn.auth.user;
    transporter.sendMail(options, callback);
};

