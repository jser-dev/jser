var db = require("../common/db");
var status = require('./status');
var self = module.exports;

//定义用户模型
var User = self.User = db.model('User', {
    email: { type: String, unique: true, required: true, trim: true }, // email
    password: { type: String, default: '', required: true, trim: true }, //密码
    name: { type: String, unique: true, required: true, trim: true }, //名字
    avatar: { type: String, default: '', required: true, trim: true }, //头像 
    score: { type: Number, default: 0 }, //积分,
    signUpAt: { type: Date, default: Date.now() },//注册时间
    role: [{ type: String, default: '' }],
    verifyCode: { type: String, default: '' }, //邮箱验证码
    status: { type: Number, default: status.user.NORMAL }// 状态
}); 

//定义话题模型
var Topic = self.Topic = db.model('Topic', {
    title: { type: String, default: '', trim: true }, //标题
    content: { type: String, default: '' }, //内容
    html: { type: String, default: '' }, //html内容
    type: [{ type: String, default: '', trim: true }], //类型
    author: { type: db.types.ObjectId, ref: User.schema.name, required: true }, //作者
    lastReplayAuthor: { type: db.types.ObjectId, ref: User.schema.name }, //回复数量
    tags: [{ type: String, default: '', trim: true }], //标签,
    createAt: { type: Date, default: Date.now() }, //创建时间
    updateAt: { type: Date, default: Date.now() }, //更新时间
    lastReplayAt: { type: Date, default: Date.now() }, //最后回复时间
    like: { type: Number, default: 0 }, //“赞” 的数量 
    dislike: { type: Number, default: 0 }, //"踩" 的数量
    top: { type: Number, default: 0 }, //置顶, 0: 不置顶，>0: 置顶（值为置顶权重）
    read: { type: Number, default: 0 }, //阅读数量
    replay: { type: Number, default: 0 }, //回复数量
    good: { type: Boolean, default: false }, //是否精华
    status: { type: Number, default: status.topic.DRAFT }// 状态,
});

//定义评论模型
var Comment = self.Comment = db.model('Comment', {
    topic: { type: db.types.ObjectId, ref: Topic.schema.name, required: true }, //所属话题
    content: { type: String, default: '', required: true }, //内容
    html: { type: String, default: '' }, //html内容
    author: { type: db.types.ObjectId, ref: User.schema.name, required: true }, //作者
    createAt: { type: Date, default: Date.now() }, //创建时间
    updateAt: { type: Date, default: Date.now() }, //更新时间
    like: { type: Number, default: 0 }, //“赞” 的数量 
    dislike: { type: Number, default: 0 }, //"踩" 的数量
    status: { type: Number, default: status.comment.PUBLISH }// 状态,
});

//定义消息模型
var Message = self.Message = db.model("Message", {
    from: { type: String }, //发送者
    to: { type: String }, //接收者
    type: { type: String },//类型
    content: { type: String },//内容
    link: { type: String },//链接
    sendAt: { type: Date, default: Date.now() }, //发送时间
    status: { type: Number, default: status.message.UNREAD }// 状态,
});

//定义权限配置模型
var Access = self.Access = db.model("Access", {
    role: { type: String }, //角色名称
    users: { type: String }, //用户id列表（逗号隔开）
});
