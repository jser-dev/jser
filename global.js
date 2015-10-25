/**
 * 全局应用程序类
 **/
var Global = module.exports = function () { };

/**
 * 在 global 中 require utils，以确保 utils 一些初始化能够完成
 **/
var utils = require('./common/utils');

Global.prototype.onStart = function (server, done) {
    done();
};

Global.prototype.onStop = function (server, done) {
    done();
};

Global.prototype.onError = function (context, done) {
    done();
};

Global.prototype.onRequestBegin = function (context, done) {
    done();
};

Global.prototype.onReceived = function (context, done) {
    done();
};

Global.prototype.onResponse = function (context, done) {
    done();
};

Global.prototype.onRequestEnd = function (context, done) {
    done();
};