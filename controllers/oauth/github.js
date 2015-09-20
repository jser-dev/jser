"use strict";
/* global nokit */

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
    self.context.session.add('oauth_state', state, function () {
        query_args.push("client_id=" + self.configs.client_id);
        query_args.push("scope=" + self.configs.scope);
        query_args.push("redirect_uri=" + self.configs.redirect_uri);
        query_args.push("state=" + state);
        self.context.redirect(self.configs.auth_url + '?' + query_args.join('&'));
    });
};

GitHubController.prototype.callback = function () {
    var self = this;
    var code = self.context.data('code');
    var state = self.context.data('state');
    self.context.content(code,"text/html");
};