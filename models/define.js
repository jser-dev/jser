var db = require("../common/db");
var self = module.exports;

/**
 * 定义话题或回复的状态
 **/
var status = self.status = {
    DELETE: -2,
    DRAFT: -1,
    NORMAL: 0,
    PUBLISH: 1,
    LOCK: 2
};

//定义用户模型
var User = self.User = db.model('User', {
    email: { type: String, unique: true, required: true }, // email
    password: { type: String, default: '', required: true }, //密码
    name: { type: String, unique: true, required: true }, //名字
    avatar: { type: String, default: '', required: true }, //头像 
    integral: { type: Number, default: 0 }, //积分,
    signUpAt: { type: Date, default: Date.now },//注册时间
    role: [{ type: String, default: '' }],
    status: { type: Number, default: status.NORMAL }// 状态
}); 

//定义话题模型
var Topic = self.Topic = db.model('Topic', {
    title: { type: String, default: '', required: true }, //标题
    content: { type: String, default: '' }, //内容
    type: [{ type: String, default: '' }], //类型
    author: { type: db.types.ObjectId, ref: User.schema.name, required: true }, //作者
    lastReplayAuthor: { type: db.types.ObjectId, ref: User.schema.name }, //回复数量
    tags: [{ type: String, default: '' }], //标签,
    createAt: { type: Date, default: Date.now }, //创建时间
    updateAt: { type: Date, default: Date.now }, //更新时间
    lastReplayAt: { type: Date, default: Date.now }, //最后回复时间
    like: { type: Number, default: 0 }, //“赞” 的数量 
    dislike: { type: Number, default: 0 }, //"踩" 的数量
    top: { type: Number, default: 0 }, //置顶, 0: 不置顶，>0: 置顶（值为置顶权重）
    read: { type: Number, default: 0 }, //阅读数量
    replay: { type: Number, default: 0 }, //回复数量
    status: { type: Number, default: status.DRAFT }// 状态,
});

//定义评论模型
var Comment = self.Comment = db.model('Comment', {
    topic: { type: db.types.ObjectId, ref: Topic.schema.name, required: true }, //所属话题
    content: { type: String, default: '', required: true }, //内容
    author: { type: db.types.ObjectId, ref: User.schema.name, required: true }, //作者
    createAt: { type: Date, default: Date.now }, //创建时间
    updateAt: { type: Date, default: Date.now }, //更新时间
    like: { type: Number, default: 0 }, //“赞” 的数量 
    dislike: { type: Number, default: 0 }, //"踩" 的数量
    status: { type: Number, default: status.PUBLISH }// 状态,
});
