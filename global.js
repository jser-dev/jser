/**
 * 在 global 中 require utils，以确保 utils 一些初始化能够完成
 **/
var utils = require('./common/utils');
var db = require("./common/db");
var qn = require("./common/qn");

/**
 * 全局应用程序类
 **/
var Global = module.exports = function () { };

Global.prototype.onStart = function (server, done) {
    //初始化 utils
    utils.init(server);
    //建立数据链接
    db.connect(server);
    //初始化七牛
    qn.init(server);
    done();
};

Global.prototype.onStop = function (server, done) {
    done();
};

Global.prototype.onError = function (context, done) {
    done();
};

Global.prototype.onRequest = function (context, done) {
    done();
};

Global.prototype.onReceived = function (context, done) {
    done();
};

Global.prototype.onResponse = function (context, done) {
    done();
};