import { TagData, TagDataKey, TagTime, TagTimeKey } from '@/types/index.type';
import dayjs from 'dayjs';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

const RootProjectPersisted = createPersistedState({
	storage: {
		getItem: key => uni.getStorageSync(key),
		setItem: (key, value) => uni.setStorageSync(key, value),
		removeItem: key => uni.removeStorageSync(key),
	}, // 持久化方式
});

export default new Vuex.Store({
	state: {
		historyTopic: [],
		adSwitch: true, // 广告
		adCloseTime: '',
		stroageTime: 15, // 缓存时长 分钟
		visited: [], // 访问过的
		myTags: [], // 我的tag
		top_time: '',
		top: [],
		all_time: '',
		all: [],
		tech_time: '',
		tech: [],
		creative_time: '',
		creative: [],
		play_time: '',
		play: [],
		apple_time: '',
		apple: [],
		qna_time: '',
		qna: [],
		hot_time: '',
		hot: [],
		r2_time: '',
		r2: [],
	},
	getters: {
		// 获取tag时间
		getTagTime(state) {
			return (key: TagTimeKey) => state[key];
		},
		// 获取tag数据
		getTagData(state) {
			return (key: TagDataKey) => state[key];
		},
	},
	mutations: {
		// 更新缓存时长
		updateStroageTime(state, data) {
			state.stroageTime = data;
		},
		// 更新我喜欢的tag
		updateMyTags(state, data) {
			state.myTags = data;
		},
		// 切换模式
		toggleAdSwitch(state, data) {
			state.adSwitch = data;
		},
		// 保存访问过的
		updateVisited(state, visited) {
			state.visited = visited;
		},
		// 更新tag数据
		updateTagData(state, tagData: TagData) {
			state[tagData.key] = tagData.value;
		},
		// 更新tag时间
		updateTagTime(state, tagTime: TagTime) {
			state[tagTime.key] = tagTime.value;
		},
		saveHistoryTopics(state, data: any) {
			let historyTopic: any = state.historyTopic.reverse();
			historyTopic = historyTopic.filter((item: any) => {
				return item.id !== data.id;
			});
			historyTopic.push(data);
			state.historyTopic = historyTopic.slice(-30).reverse();
		},
		clearHistory(state) {
			state.historyTopic = [];
			state.visited = [];
		},
		saveAdCloseTime(state) {
			state.adCloseTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
		},
		updateAdSwitch(state) {
			const adCloseTime = state.adCloseTime;
			if (!adCloseTime) {
				state.adSwitch = true;
				return;
			}
			// 如果今天是周一
			if (dayjs().day() === 1) {
				// 不是当天关闭广告的
				if (dayjs().isAfter(adCloseTime, 'day')) {
					state.adSwitch = true;
				}
			}
		},
	},
	actions: {},
	modules: {},
	plugins: [RootProjectPersisted],
});
