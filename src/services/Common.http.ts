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
