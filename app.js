/* global __dirname */
/**
 * 自动生成的应用入口程序
 *
 * 使用 nokit start 命令启动时，会忽略此入口程序
 * 通常以下情况使用此入口程序:
 *     1) 在使用进程管理工具(pm2等)时
 *     2) 目标 "环境" 无法使用 nokit start 命令时
 *
 * 确保添加了对 nokit 的依赖，或全局安装了 nokit 并设置了 NODE_PATH 环境变量
 *
 * 安装命令:
 * npm install nokitjs [-g]
 **/

var nokit = require("nokitjs");
var console = nokit.console;

var options = {};

/**
 * 设定应程序的根目录
 */
options.root = __dirname;

/**
 * 启动 server
 **/
var server = new nokit.Server(options);
server.start(function (err, msg) {
    if (err) {
        console.error(err);
    } else {
        console.log(msg);
    }
});

//eof
