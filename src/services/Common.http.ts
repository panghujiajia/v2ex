import { http } from './index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import store from '@/vuex/index';

dayjs.extend(relativeTime);

export const $getTabTopics = async (tab: string) => {
    try {
        const res = await http.get(`/topics/tab/${tab}`);
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getAllTopics = async (params: {
    tab: string;
    p: number | string;
}) => {
    try {
        const res = await http.get(`/topics/all/${params.tab}/${params.p}`, {
            custom: {
                auth: !!store.state.cookie
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getTopicDetail = async (params: {
    id: string;
    p: string | number;
}) => {
    try {
        const res = await http.get(`/topics/detail/${params.id}/${params.p}`, {
            custom: {
                auth: !!store.state.cookie
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getLoginParams = async () => {
    try {
        const res = await http.get('/login/params', {
            custom: {
                loading: false
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $login = async (params: any) => {
    try {
        const res = await http.post('/login', params);
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getTopTagConfig = async () => {
    try {
        const res = await http.get('/config/tag/top', {
            custom: {
                loading: false
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getV2exConfig = async () => {
    try {
        const res = await http.get('/config/v2ex', {
            custom: {
                loading: false
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getAllTagConfig = async () => {
    try {
        const res = await http.get('/config/tag/all', {
            custom: {
                auth: !!store.state.cookie,
                loading: false
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getUserInfo = async (username: string) => {
    try {
        const res = await http.get(`/member/${username}`, {
            custom: {
                auth: true,
                loading: false
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getUserTopics = async (params: {
    username: string;
    p: string | number;
}) => {
    try {
        const res = await http.get(
            `/member/${params.username}/topics/${params.p}`,
            {
                custom: {
                    auth: !!store.state.cookie
                }
            }
        );
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getUserReplys = async (params: {
    username: string;
    p: string | number;
}) => {
    try {
        const res = await http.get(
            `/member/${params.username}/replies/${params.p}`,
            {
                custom: {
                    auth: !!store.state.cookie
                }
            }
        );
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getUserMessage = async (p: string | number) => {
    try {
        const res = await http.get(`/message/${p}`, {
            custom: {
                auth: true
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getLoginRewardInfo = async () => {
    try {
        const res = await http.get('/mission/daily', {
            custom: {
                auth: true,
                loading: false
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getLoginReward = async () => {
    try {
        const res = await http.post(
            '/mission/daily',
            {},
            {
                custom: {
                    auth: true
                }
            }
        );
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getUserBalance = async () => {
    try {
        const res = await http.get('/balance', {
            custom: {
                auth: true,
                loading: false
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getUserNotifications = async () => {
    try {
        const res = await http.get('/notifications', {
            custom: {
                auth: true,
                loading: false
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $replyTopic = async (params: any) => {
    try {
        const res = await http.post('/t', params, {
            custom: {
                auth: true
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};
