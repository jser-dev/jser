var qn = require("../common/qn");
var utils = require("../common/utils");
/**
 * UploadController
 **/
var UploadController = function () { };

/**
 * 初始化方法，每次请求都会先执行 init 方法
 **/
UploadController.prototype.init = function () {
    var self = this;
    self.ready();
}

/**
 * 默认 action
 **/
UploadController.prototype.index = function () {
    var self = this;
    var imageFile = self.context.req.files["image"];
    if (!imageFile || imageFile.size < 1) {
        return self.context.json({
            err: "图片不合法"
        });
    }
    var fileKey = "topic-" + utils.newGuid();
    qn.client.uploadImage(imageFile.path, fileKey, function (err, result) {
        if (err) {
            return self.context.json({
                err: err.message || err
            });
        }
        var imageUrl = qn.client.getUrl(fileKey);
        self.context.json({
            err: false,
            url: imageUrl
        });
    });
};

module.exports = UploadController;

