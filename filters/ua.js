var UserAgentFilter = function () { };

UserAgentFilter.prototype.onMvcHandle = function (context, next) {
    var userAgent = context.request.clientInfo.userAgent || '';
    context.userAgent = userAgent;
    context.isWeChat = userAgent.indexOf("MicroMessenger") > -1;
    next();
};

module.exports = UserAgentFilter;