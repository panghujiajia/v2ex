import { http } from './index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const $getTabTopics = async (tab: string) => {
    try {
        const res = await http.get(`/topics/tab/${tab}`);
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getAllTopics = async (params: { tab: string; p: number }) => {
    try {
        const res = await http.get(`/topics/all/${params.tab}/${params.p}`);
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
        const res = await http.get(`/topics/detail/${params.id}/${params.p}`);
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getLoginParams = async () => {
    try {
        const res = await http.get('/login/params');
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
        const res = await http.get('/config/tag/top');
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getUserInfo = async (username: string) => {
    try {
        const res = await http.get(`/member/${username}`, {
            custom: {
                auth: true
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};

export const $getUserTopics = async (username: string) => {
    try {
        const res = await http.get(`/member/${username}/topics`, {
            custom: {
                auth: true
            }
        });
        return res.data.data;
    } catch (error) {
        return false;
    }
};
