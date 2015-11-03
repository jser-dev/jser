"use strict";

var request = require('request');
var User = require('../../models/user');
var utils = require("../../common/utils");

/* global nokit */

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

//github 回调
GitHubController.prototype.callback = function () {
    var self = this;
    var code = self.context.data('code');
    var state = self.context.data('state');
    self.context.session.get(OAUTH_STATE_SESSION_KEY, function (_state) {
        if (_state != state) {
            return self.context.error("OAuth 认证在验证 state 时,发现不匹配。");
        }
        request.post({
            "url": self.configs.token_url,
            "headers": {
                "Accept": "application/json"
            },
            "formData": {
                "client_id": self.configs.client_id,
                "client_secret": self.configs.client_secret,
                "code": code,
                "state": state
                // ,
                // "redirect_uri": self.configs.redirect_uri
            }
        }, function (err, httpResponse, body) {
            if (err) {
                return self.context.error(err);
            }
            var tokenResult = JSON.parse(body);
            var userInfoUrl = self.configs.user_url + "?access_token=" + tokenResult.access_token;
            request({
                "url": userInfoUrl,
                "headers": {
                    "User-Agent": "JSER"//Awesome-Octocat-App
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    return self.context.error(err);
                }
                var userInfo = JSON.parse(body);
                var user = new User();
                user.email = userInfo.email;
                user.name = userInfo.login || userInfo.email;
                user.avatar = userInfo.avatar_url;
                user.password = utils.newGuid();
                User.oAuth(user, function (err, authedUser) {
                    if (err) {
                        return self.context.error(err);
                    }
                    self.context.session.set('user', authedUser, function () {
                        self.context.redirect("/");
                    });
                });
            });
        });
    });
};