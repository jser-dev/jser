var utils = require("../common/utils");
var Access = require("../models/access");

/**
 * 活动控制器
 **/
var ControlPanelController = function () { };

var convertAccessList = function (accessList) {
    var access = {};
    accessList.forEach(function (item) {
        access[item.role] = item.users;
    });
    return access;
};

/**
 * 默认 action
 **/
ControlPanelController.prototype.index = function () {
    var self = this;
    Access.read(function (err, accessList) {
        if (err) {
            return self.context.error(err);
        }
        self.render("control-panel.html", {
            access: convertAccessList(accessList)
        });
    });
};

/**
 * 保存权限配置
 **/
ControlPanelController.prototype.saveAccess = function () {
    var self = this;
    var configs = self.context.configs;
    var accessList = [];
    utils.each(configs.roles, function (roleName) {
        accessList.push({
            role: roleName,
            users: self.context.params(roleName)
        });
    });
    Access.save(accessList, function (err) {
        if (err) {
            return self.context.error(err);
        }
        self.context.redirect("/control-panel");
    });
};

module.exports = ControlPanelController;