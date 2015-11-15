//定议实体状态
module.exports = {
	topic: {
		DELETED: -2,
		DRAFT: -1,
		NORMAL: 0,
		PUBLISH: 1,
		LOCK: 2
	},
	comment: {
		DELETED: -2,
		DRAFT: -1,
		NORMAL: 0,
		PUBLISH: 1,
		LOCK: 2
	},
	user: {
		DELETED: -1,
		NORMAL: 0,
		LOCK: 1
	},
	message: {
		DELETED: -1,
		UNREAD: 0,
		READ: 1
	}
};