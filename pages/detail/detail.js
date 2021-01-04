import detailService from "../../services/detail.service";
const dayjs = require("../../utils/dayjs.min.js");
const zh_cn = require("../../utils/zh-cn.js");
const relativeTime = require("../../utils/relativeTime.js");
dayjs.extend(relativeTime);
dayjs.locale(zh_cn);
const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		topicsDetail: null, // 主题详情
		topicsReplies: [], // 主题回复
		endTime: "", // 回复截止时间
		loading: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.hideLoading();
		const detail = detailService.$getTopicsDetail(options.id);
		const reply = detailService.$getTopicsReplies(options.id);
		Promise.all([detail, reply])
			.then((res) => {
				this.getTopicsDetail(res[0][0]);
				this.getTopicsReplies(res[1]);
			})
			.catch((err) => {
				wx.showToast({
					title: "加载失败，请重试",
					icon: "none",
				});
			});
	},
	// 获取主题详情
	getTopicsDetail(res) {
		let topicsDetail = null;
		topicsDetail = {
			data: app.towxml(res.content, "markdown"),
			lastReply:
				dayjs(res.created * 1000)
					.startOf("hour")
					.fromNow() + " ",
			lastReplyBy: `由 ${res.last_reply_by} 创建`,
			nodeName: res.node.title,
			title: res.title,
			author: res.member.username,
			avatarUrl: res.member.avatar_mini,
			id: res.member.id,
			detail: true,
		};
		this.setData({
			topicsDetail: topicsDetail,
		});
	},
	// 获取主题回复
	getTopicsReplies(res) {
		const len = res.length;
		if (!len) {
			this.setData({
				loading: false,
			});
			wx.hideLoading();
			return;
		}
		for (let i = 0; i < len; i++) {
			const item = res[i];
			item.content = app.towxml(item.content, "markdown");
			item.timeBefore =
				item.last_modified &&
				dayjs(item.last_modified * 1000)
					.startOf("hour")
					.fromNow();
		}
		const endTime =
			res[len - 1].last_modified &&
			dayjs(res[len - 1].last_modified * 1000).format();
		this.setData({
			topicsReplies: res,
			endTime: endTime,
			loading: false,
		});
		wx.hideLoading();
	},
});
