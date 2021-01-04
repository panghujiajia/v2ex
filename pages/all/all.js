import allService from "../../services/all.service";
import { tags, rules } from "../../utils/config";
import dayjs from "dayjs";
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tags,
		curTag: "all",
		tagData: [], // 全部数据
		tagList: [], // 主题内容
		visited: [], // 访问过的
		pageSize: 1, // 起始页码
		totalPage: 1, // 总页码
		loading: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: "正在加载中...",
			mask: true,
		});
		const visited = wx.getStorageSync("visited") || [];
		const name = this.data.curTag;
		if (visited.length) {
			this.setData({
				visited,
			});
		}
		// 如果没拿到数据就调接口
		if (!this.getStorageData(name)) {
			this.getTagTopics(name);
		}
	},
	// 从缓存取数据
	getStorageData(name) {
		const time = wx.getStorageSync(name + "_time") || "";
		if (!time) {
			return false;
		} else {
			const old = dayjs(time);
			const now = dayjs(dayjs().format("YYYY-MM-DD HH:mm:ss"));
			// 缓存时间超过15分钟,则重新请求数据
			if (old.diff(now, "minute") <= 15) {
				return false;
			}
			const tagData = wx.getStorageSync(name) || [];
			if (tagData.length) {
				const visited = this.data.visited;
				this.data.tagData = tagData;
				this.getTotalPage(tagData.length);
				tagData.forEach((item) => {
					if (visited.includes(item.id)) {
						item.beVisited = true;
					}
				});
				this.setData({
					tagList: tagData.slice(0, 10),
					loading: false,
				});
				wx.hideLoading();
				return true;
			}
		}
		return false;
	},
	// tag点击事件
	onClick(event) {
		wx.showLoading({
			title: "正在加载中...",
			mask: true,
		});
		this.setData({
			loading: true,
			pageSize: 1,
		});
		const name = event.detail.name;
		// 如果没拿到数据就调接口
		if (!this.getStorageData(name)) {
			this.getTagTopics(name);
		}
	},
	// 获取总页数
	getTotalPage(len) {
		const totalPage = parseInt(len / 10) + (len % 10 > 0 ? 1 : 0);
		this.setData({ totalPage });
	},
	// 根据tag获取内容
	getTagTopics(name) {
		allService
			.$getTagTopics1(name)
			.then((res) => {
				// 去掉换行符
				var str = res.trim().replace(/\n|\&nbsp;|•/g, "");
				// 拿到主题列表
				var arr = str.match(rules.item_reg);
				var len = arr.length;
				// 数据
				var tagArr = [];
				const visited = this.data.visited;
				for (var i = 0; i < len; i++) {
					var item = arr[i];
					var titleArr = item.split(rules.title_reg);
					var avatarArr = item.split(rules.avatar_reg);
					var nodeArr = item.split(rules.node_reg);

					var lastReply = "";
					var lastReplyBy = "";
					// 有人回复
					if (titleArr[2] > 0) {
						lastReply = item.split(rules.repay_reg_1)[4];
						lastReplyBy = item.split(rules.repay_reg_1)[5];
					} else {
						lastReply = item.split(rules.repay_reg_0)[3];
					}
					var beVisited = false;
					if (visited.includes(titleArr[1])) {
						beVisited = true;
					}
					var tagObj = {
						id: titleArr[1], // id
						replyNo: titleArr[2], // 回复数
						title: titleArr[3], // 标题
						lastReply: lastReply, // 最后回复时间
						lastReplyBy: lastReplyBy, // 最后回复人
						author: avatarArr[1], // 作者名
						avatarUrl: avatarArr[2], // 头像地址
						nodeUrl: nodeArr[1], // node地址
						nodeName: nodeArr[2], // node名
						beVisited,
					};
					if (tagObj.id && tagObj.title) {
						tagArr.push(tagObj);
					}
				}
				wx.pageScrollTo({
					scrollTop: 0,
				});
				const dataLen = tagArr.length;
				this.getTotalPage(dataLen);
				wx.setStorage({
					key: name,
					data: tagArr,
				});
				wx.setStorage({
					key: name + "_time",
					data: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				});
				this.data.tagData = tagArr;
				this.setData({
					tagList: tagArr.slice(0, 10),
					loading: false,
				});
				wx.hideLoading();
			})
			.catch((err) => {
				const tagData = wx.getStorageSync(name) || [];
				if (!tagData.length) {
					wx.showToast({
						title: "加载失败，请重试",
						icon: "none",
					});
					return;
				}
				this.data.tagData = tagData;
				this.getTotalPage(tagData.length);
				this.setData({
					tagList: tagData.slice(0, 10),
					loading: false,
				});
				wx.hideLoading();
			});
	},
	// 跳转主题详情
	getTopicsDetail(e) {
		const id = e.currentTarget.dataset.id + "";
		let visited = this.data.visited;
		let list = this.data.tagList;
		if (visited.length) {
			if (!visited.includes(id)) {
				visited.push(id);
				const target = list.find((item) => {
					return item.id == id;
				});
				target.beVisited = true;
				this.setData({
					tagList: list,
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
	onReachBottom: function () {
		const tagData = this.data.tagData;
		let pageSize = this.data.pageSize;
		if (pageSize >= this.data.totalPage) {
			return;
		}
		pageSize++;
		let data = tagData.slice(0, pageSize * 10);
		this.setData({
			tagList: data,
			pageSize,
		});
	},
});
