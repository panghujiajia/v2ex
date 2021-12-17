import dayjs from 'dayjs';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import {
    $getLoginReward,
    $getLoginRewardInfo,
    $getUserBalance,
    $getUserInfo
} from '@/services/Common.http';

Vue.use(Vuex);

const RootProjectPersisted = createPersistedState({
    storage: {
        getItem: key => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value),
        removeItem: key => uni.removeStorageSync(key)
    } // 持久化方式
});

export default new Vuex.Store({
    state: {
        cookie: '',
        userInfo: {},
        autoSign: false,
        historyTopic: [],
        adCloseTime: '',
        stroageTime: 15, // 缓存时长 分钟
        visited: [], // 访问过的
        myTags: [] // 我的tag
    },
    getters: {
        // 获取tag时间
        getTagTime(state: any) {
            return (key: string) => state[key];
        },
        // 获取tag数据
        getTagData(state: any) {
            return (key: string) => state[key];
        },
        getToday() {
            return dayjs().format('YYYY-MM-DD');
        }
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
        // 保存访问过的
        updateVisited(state, visited) {
            state.visited = visited;
        },
        // 更新tag数据
        updateTagData(state: any, tagData: any) {
            state[tagData.key] = tagData.value;
        },
        // 更新tag时间
        updateTagTime(state: any, tagTime: any) {
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
        saveCookie(state, data) {
            state.cookie = data;
        },
        saveUserInfo(state, data) {
            state.userInfo = { ...state.userInfo, ...data };
        },
        toggleAutoSign(state, data) {
            state.autoSign = data;
        },
        clearAllStorage(state) {
            state.cookie = '';
            state.userInfo = {};
            state.historyTopic = [];
            state.visited = [];
            state.myTags = [];
        }
    },
    actions: {
        async getUserBalance({ commit, state, getters }) {
            const { today } = state.userInfo;
            if (today && today === getters.getToday) {
                return;
            }
            const data = await $getUserBalance();
            if (data) {
                commit('saveUserInfo', { balance: data });
            }
        },
        async getUserInfo({ commit, state }) {
            const data = await $getUserInfo(state.userInfo.username);
            if (data) {
                let { info } = data;
                info = info.split('，')[0];
                commit('saveUserInfo', { ...data, info });
            }
        },
        async getLoginRewardInfo({ commit, dispatch, state, getters }) {
            const { today } = state.userInfo;
            if (today && today === getters.getToday) {
                return;
            }
            const data = await $getLoginRewardInfo();
            if (data) {
                const { is_sign_in } = data;
                const today = getters.getToday;
                if (!is_sign_in && state.autoSign) {
                    await dispatch('getLoginReward');
                    return;
                }
                commit('saveUserInfo', { ...data, today });
            }
        },
        async getLoginReward({ commit, getters }) {
            const data = await $getLoginReward();
            if (data) {
                const { sign_in_day } = data;
                const today = getters.getToday;
                uni.showToast({
                    title: `签到成功，${sign_in_day}`,
                    icon: 'none'
                });
                commit('saveUserInfo', { ...data, today });
            }
        }
    },
    modules: {},
    plugins: [RootProjectPersisted]
});
