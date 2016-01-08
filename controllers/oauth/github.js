"use strict";
/* global nokit */

var request = require('request');
var User = require('../../models/user');
var utils = require("../../common/utils");
var Task = nokit.Task;

var OAUTH_STATE_SESSION_KEY = "oauth_state";

/**
 * GitHub 认证控制器
 **/
var GitHubController = module.exports = function (context) {
    var self = this;
    self.configs = context.configs.oauth.github;
};

/**
 * 默认 action
 **/
GitHubController.prototype.index = function () {
    var self = this;
    var query_args = [];
    var state = nokit.utils.newGuid();
    self.context.session.set(OAUTH_STATE_SESSION_KEY, state, function () {
        query_args.push("client_id=" + self.configs.client_id);
        query_args.push("scope=" + self.configs.scope);
        query_args.push("redirect_uri=" + self.configs.redirect_uri);
        query_args.push("state=" + state);
        self.context.redirect(self.configs.auth_url + '?' + query_args.join('&'));
    });
};

/**
 * 获取 GitHub 用户的授权 token
 **/
GitHubController.prototype.getToken = function (callback) {
    var self = this;
    var code = self.context.params('code');
    var state = self.context.params('state');
    self.context.session.get(OAUTH_STATE_SESSION_KEY, function (_state) {
        if (_state != state) {
            return self.context.error("OAuth 认证在验证 state 时,发现不匹配。");
        }
        request.post({
            "url": self.configs.token_url,
            "headers": {
                "Accept": "application/json",
                "X-OAuth-Scopes": self.configs.scope,
                "X-Accepted-OAuth-Scopes": self.configs.scope
            },
            "formData": {
                "client_id": self.configs.client_id,
                "client_secret": self.configs.client_secret,
                "code": code,
                "state": state
            }
        }, function (err, httpResponse, body) {
            var tokenResult = JSON.parse(body);
            callback(err, tokenResult || {});
        });
    });
};

/**
 * 获取 GitHub 用户的基本信息
 **/
GitHubController.prototype.getUserInfo = function (access_token, callback) {
    var self = this;
    var userInfoUrl = self.configs.user_url + "?access_token=" + access_token;
    request({
        "url": userInfoUrl,
        "headers": {
            "User-Agent": "JSER",//Awesome-Octocat-App,
            "X-OAuth-Scopes": self.configs.scope,
            "X-Accepted-OAuth-Scopes": self.configs.scope
        }
    }, function (err, httpResponse, body) {
        var userInfo = JSON.parse(body);
        callback(err, userInfo || {});
    });
};

/**
 * 获取 GitHub 用户的 email
 **/
GitHubController.prototype.getEmail = function (access_token, callback) {
    var self = this;
    request({
        "url": self.configs.email_url + "?access_token=" + access_token,
        "headers": {
            "User-Agent": "JSER",//Awesome-Octocat-App,
            "X-OAuth-Scopes": self.configs.scope,
            "X-Accepted-OAuth-Scopes": self.configs.scope
        }
    }, function (err, httpResponse, body) {
        var emailArray = JSON.parse(body);
        callback(err, emailArray || []);
    });
};

//github 回调
GitHubController.prototype.callback = function () {
    var self = this;
    var task = new Task();
    task.add({
        "getToken": function (done) {
            self.getToken(done);
        },
        "getUserInfo": function (done) {
            var tokenResult = task.result["getToken"];
            self.getUserInfo(tokenResult.access_token, done);
        }
    });
    task.seq(function (err, result) {
        if (err) {
            return self.context.error(err);
        }
        var userInfo = task.result["getUserInfo"];
        if (userInfo.email) {
            self.loginUser(userInfo);
        } else {
            var tokenResult = task.result["getToken"];
            self.getEmail(tokenResult.access_token, function (err, emailArray) {
                if (err) {
                    return self.context.error(err);
                }
                var emailItem = self.parseEmail(emailArray);
                userInfo.email = emailItem.email;
                self.loginUser(userInfo);
            });
        }
    });
};

/**
 * 解析 email
 **/
GitHubController.prototype.parseEmail = function (emailArray) {
    //查找主 email
    var emailItem = emailArray.filter(function (item) {
        return item.primary;
    })[0];
    if (!emailItem) {
        //查找验证过的第一个 email
        emailItem = emailArray.filter(function (item) {
            return item.verified;
        })[0];
    }
    return emailItem || emailArray[0] || {};;
};

/**
 * 登录 OAuth 认证为的用户
 **/
GitHubController.prototype.loginUser = function (userInfo) {
    var self = this;
    var user = new User();
    user.email = userInfo.email;
    user.name = "GitHub-" + (userInfo.login || userInfo.email);
    user.avatar = userInfo.avatar_url;
    user.password = utils.newGuid();
    user.verifyCode = "";
    User.oAuth(user, function (err, authedUser) {
        if (err) {
            return self.context.error(err);
        }
        self.context.session.set('user', authedUser, function () {
            self.session.get("referer", function (referer) {
                self.context.redirect(referer || "/");
            });
        });
    });
};