import { TagData, TagDataKey, TagTime, TagTimeKey } from '@/types/index.type';
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
		darkModel: false, // 夜间模式
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
		toggleDarkModel(state, data) {
			state.darkModel = data;
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
	},
	actions: {},
	modules: {},
	plugins: [RootProjectPersisted],
});
