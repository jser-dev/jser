var qn = require("qn");
var fs = require("fs");
var utils = require("../common/utils");

var self = module.exports;

//初始化
self.init = function (server) {
    var qnConfigs = server.configs.qiniu;

    self.client = qn.create({
        accessKey: qnConfigs.accessKey,
        secretKey: qnConfigs.secretKey,
        bucket: qnConfigs.bucket,
        origin: qnConfigs.origin
    });
    
    /**
     * 上传图片
     **/
    self.client.uploadImage = function (filePath, fileKey, callback) {
        self.client.upload(fs.createReadStream(filePath), {
            key: fileKey
        }, function (err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    };

    self.client.getUrl = function (fileKey) {
        return self.client.options.origin + "/" + fileKey;
    }
};