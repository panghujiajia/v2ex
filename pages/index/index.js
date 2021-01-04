import indexService from "../../services/index.service";
const dayjs = require("../../utils/dayjs.min.js");
const zh_cn = require("../../utils/zh-cn.js");
const relativeTime = require("../../utils/relativeTime.js");
dayjs.extend(relativeTime);
dayjs.locale(zh_cn);
Page({
	data: {
		hotList: [], // 热门列表
		visited: [], // 访问过的
		loading: true,
	},
	onLoad: function () {
		wx.showLoading({
			title: "正在加载中...",
			mask: true,
		});
		const visited = wx.getStorageSync("visited") || [];
		if (visited.length) {
			this.setData({
				visited,
			});
		}
		const time = wx.getStorageSync("hot_time") || "";
		if (!time) {
			this.getHotList();
			return;
		} else {
			const old = dayjs(time);
			const now = dayjs(dayjs().format("YYYY-MM-DD HH:mm:ss"));
			// 缓存时间超过15分钟,则重新请求数据
			if (old.diff(now, "minute") <= 15) {
				this.getHotList();
				return;
			}
			const tagData = wx.getStorageSync("hot") || [];
			if (tagData.length) {
				const visited = this.data.visited;
				tagData.forEach((item) => {
					if (visited.includes(item.id)) {
						item.beVisited = true;
					}
				});
				this.setData({
					hotList: tagData,
					loading: false,
				});
				wx.hideLoading();
				return;
			}
		}
	},
	// 跳转主题详情
	getTopicsDetail(e) {
		const id = e.currentTarget.dataset.id + "";
		let visited = this.data.visited;
		let list = this.data.hotList;
		if (visited.length) {
			if (!visited.includes(id)) {
				visited.push(id);
				const target = list.find((item) => {
					return item.id == id;
				});
				target.beVisited = true;
				this.setData({
					hotList: list,
				});
			}
		} else {
			visited = [id];
		}
		this.setData({
			visited,
		});
		wx.setStorage({
			key: "visited",
			data: visited,
		});
		wx.navigateTo({
			url: `/pages/detail/detail?id=${id}`,
		});
	},
	// 获取热门列表
	getHotList() {
		indexService
			.$getHotList()
			.then((res) => {
				const len = res.length;
				const hotList = [];
				const visited = this.data.visited;
				for (let i = 0; i < len; i++) {
					const item = res[i];
					var lastReply =
						dayjs(item.last_modified * 1000)
							.startOf("hour")
							.fromNow() + " ";
					var beVisited = false;
					if (visited.includes(item.id)) {
						beVisited = true;
					}
					const tagObj = {
						id: item.id, // id
						replyNo: item.replies, // 回复数
						title: item.title, // 标题
						lastReply, // 最后回复时间
						lastReplyBy: `最后回复来自 ${item.last_reply_by}`, // 最后回复人
						author: item.member.username, // 作者名
						avatarUrl: item.member.avatar_mini, // 头像地址
						nodeUrl: item.node.name, // node地址
						nodeName: item.node.title, // node名
						beVisited,
					};
					hotList.push(tagObj);
				}
				wx.setStorage({
					key: "hot",
					data: hotList,
				});
				wx.setStorage({
					key: "hot_time",
					data: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				});
				this.setData({
					hotList,
					loading: false,
				});
				wx.hideLoading();
			})
			.catch((err) => {
				const tagData = wx.getStorageSync("hot") || [];
				if (!tagData.length) {
					wx.showToast({
						title: "加载失败，请重试",
						icon: "none",
					});
					return;
				}
				this.setData({
					hotList: tagData,
					loading: false,
				});
				wx.hideLoading();
			});
	},
});
