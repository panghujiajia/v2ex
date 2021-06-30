import { http } from './index';
import qs from 'qs';
import rules from '@/utils/config';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const $getTabTopics = async (tab: string) => {
	try {
		const res = await http.get('/api/topics/tab', {
			params: {
				tab,
			},
		});
		return res.data.data;
	} catch (error) {
		return false;
	}
};

export const $getAllTopics = async (params: { tab: string; p: number }) => {
	try {
		const res = await http.get('/api/topics/all', {
			params,
		});
		return res.data.data;
	} catch (error) {
		return false;
	}
};

export const $getTopicDetail = async (id: string) => {
	try {
		const res = await http.get('/api/topics/detail', {
			params: {
				id,
			},
		});
		return res.data.data;
	} catch (error) {
		return false;
	}
};

export const $getLoginParams = async () => {
	try {
		const res = await http.get('/api/getLoginParams');
		return res.data.data;
	} catch (error) {
		return false;
	}
};

export const $login = async (param: any, cookie: any) => {
	try {
		const res = await http.post('/api/login', { param, cookie });
		console.log(res);
		return res.data.data;
	} catch (error) {
		return false;
	}
};
