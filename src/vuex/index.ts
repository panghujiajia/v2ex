import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import {
    $getAllTagConfig,
    $getLoginReward,
    $getLoginRewardInfo,
    $getUserBalance,
    $getUserInfo,
    $getUserNotifications,
    $getV2exConfig
} from '@/services/Common.http';
import topTags from '@/config/topTag.config';
import allTags from '@/config/allTag.config';

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
        notifications: 0,
        theme: 'deep',
        autoNavigate: true,
        userInfo: {
            avatar: '',
            balance: [],
            sign_in_day: '',
            info: '',
            is_sign_in: '',
            username: '',
            password: ''
        },
        autoSign: false,
        v2exConfig: {
            tag: topTags,
            toast: []
        },
        allTag: allTags,
        historyTopic: [],
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
        tags(state) {
            return state.v2exConfig.tag;
        },
        toasts(state) {
            return state.v2exConfig.toast;
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
        toggleAutoNavigate(state, data) {
            state.autoNavigate = data;
        },
        clearAllStorage(state) {
            state.cookie = '';
            state.historyTopic = [];
            state.visited = [];
            state.myTags = [];
            state.userInfo = {
                avatar: '',
                balance: [],
                sign_in_day: '',
                info: '',
                is_sign_in: '',
                username: ''
            };
            state.autoSign = false;
        },
        saveV2exConfig(state, data) {
            state.v2exConfig = data;
        },
        saveAllTag(state, data) {
            state.allTag = data;
        },
        saveNotifications(state, data) {
            state.notifications = data;
        }
    },
    actions: {
        async getAllTagConfig({ commit }) {
            const data = await $getAllTagConfig();
            if (data) {
                commit('saveAllTag', data);
            }
        },
        async getV2exConfig({ commit }) {
            const data = await $getV2exConfig();
            if (data) {
                commit('saveV2exConfig', data);
            }
        },
        async getUserBalance({ commit }) {
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
            const data = await $getLoginRewardInfo();
            if (data) {
                const { is_sign_in } = data;
                if (!is_sign_in && state.autoSign) {
                    await dispatch('getLoginReward');
                    return;
                }
                commit('saveUserInfo', data);
            }
        },
        async getLoginReward({ commit }) {
            const data = await $getLoginReward();
            if (data) {
                const { sign_in_day, is_sign_in } = data;
                if (is_sign_in) {
                    uni.showToast({
                        title: `签到成功，${sign_in_day}`,
                        icon: 'none'
                    });
                } else {
                    uni.showToast({
                        title: '多次签到不成功可尝试重新登录再试',
                        icon: 'none'
                    });
                }
                commit('saveUserInfo', data);
            }
        },
        async getUserNotifications({ commit }) {
            const data = await $getUserNotifications();
            if (data) {
                uni.setTabBarBadge({
                    index: 2,
                    text: data.toString()
                });
                commit('saveNotifications', data);
            } else {
                uni.removeTabBarBadge({
                    index: 2
                });
                commit('saveNotifications', 0);
            }
        }
    },
    modules: {},
    plugins: [RootProjectPersisted]
});
