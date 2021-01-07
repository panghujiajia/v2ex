import http from './index';
import qs from 'qs';
import rules from '@/utils/config';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
// 获取验证码
export const $getCaptchaBase64 = async (
	once: string,
	cookie: string
): Promise<any> => {
	try {
		const res = await http.get(`/_captcha?once=${once}`, {
			header: {
				// 'referer': 'https://www.v2ex.com/signin',
				// 'Sec-Fetch-Dest': 'image',
				// 'Sec-Fetch-Site': 'same-origin',
				Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
				'Accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
				cookie,
			},
			responseType: 'arraybuffer',
		});
		const buffer = res.data;
		return 'data:image/png;base64,' + uni.arrayBufferToBase64(buffer);
	} catch (error) {
		return false;
	}
};
export const $login = async (params: any, cookie: any) => {
	params = qs.stringify(params);
	try {
		const res = await http.post('/signin', params, {
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				cookie,
			},
		});
		console.log(res);
	} catch (error) {
		return false;
	}
};
// 登录(取name)
export const $signin = async (): Promise<any> => {
	try {
		const res = await http.get('/signin');
		const data = res.data;
		// 拿到cookie列表
		const cookies = res.cookies;
		let cookie = cookies.map((item: string) => {
			return item.split(';')[0];
		});
		// 取到需要的值进行拼装
		cookie = cookie.join(';');
		// 去掉换行符
		const str = data.trim().replace(/\n|\&nbsp;|•/g, '');
		// 拿到主题列表
		const arr = str.split(rules.reg_login_name);
		const once = str.split(rules.reg_once)[1];
		// tslint:disable-next-line: variable-name
		const [username_key, password_key, code_key] = [arr[2], arr[5], arr[8]];
		return { username_key, password_key, code_key, once, cookie };
	} catch (error) {
		return false;
	}
};

// /api/topics/latest.json  最新
// 最热
export const $getHotList = async () => {
	try {
		const res = await http.get('/api/topics/hot.json');
		const data = res.data;
		const newData = data.map((item: any) => {
			const lastReply = dayjs(item.last_modified * 1000)
				.startOf('hour')
				.fromNow();
			return {
				id: item.id, // id
				replyNo: item.replies, // 回复数
				title: item.title, // 标题
				lastReply, // 最后回复时间
				author: item.member.username, // 作者名
				avatarUrl: item.member.avatar_mini, // 头像地址
				tagValue: item.node.name, // node地址
				tagName: item.node.title, // node名
			};
		});
		return newData;
	} catch (error) {
		return false;
	}
};
// 获取节点下的所有帖子，带分页
export const $getTagTopics = async (params: any) => {
	try {
		const res = await http.get(`/go/${params.value}?p=${params.pageNum}`);
		const data = res.data;
		// 去掉换行符
		const str = data.trim().replace(/\n|\&nbsp;|•/g, '');
		// 拿到主题列表
		const arr = str.match(rules.reg_item);
		const newData = arr.map((item: any) => {
			const titleArr = item.split(rules.reg_title);
			const avatarArr = item.split(rules.reg_avatar);
			const tagArr = item.split(rules.reg_tag);
			let lastReply = '';
			lastReply = item.split(rules.reg_repay_0)[2];
			lastReply = lastReply.split(/\s\s(.*?)\s\s(.*?)/)[3];
			return {
				id: titleArr[1], // id
				replyNo: titleArr[2], // 回复数
				title: titleArr[3], // 标题
				lastReply, // 最后回复时间
				author: avatarArr[1], // 作者名
				avatarUrl: avatarArr[2], // 头像地址
				tagValue: tagArr.length && tagArr[1], // node地址
				tagName: tagArr.length && tagArr[2], // node名
			};
		});
		return newData.filter((item: any) => {
			return !!item;
		});
	} catch (error) {
		return false;
	}
};
// '全部'
export const $getAllTopics = async (params: string) => {
	try {
		const res = await http.get(`?tab=${params}`);
		const data = res.data;
		// 去掉换行符
		const str = data.trim().replace(/\n|\&nbsp;|•/g, '');
		// 拿到主题列表
		const arr = str.match(rules.reg_item);
		const newData = arr.map((item: any) => {
			const titleArr = item.split(rules.reg_title);
			const avatarArr = item.split(rules.reg_avatar);
			const tagArr = item.split(rules.reg_tag);
			let lastReply = '';
			// 有人回复
			if (titleArr[2] > 0) {
				lastReply =
					titleArr[4] && titleArr[4].split(rules.reg_repay_1)[1];
			} else {
				lastReply =
					titleArr[4] && titleArr[4].split(rules.reg_repay_0)[1];
			}
			return {
				id: titleArr[1], // id
				replyNo: titleArr[2], // 回复数
				title: titleArr[3], // 标题
				lastReply, // 最后回复时间
				author: avatarArr[1], // 作者名
				avatarUrl: avatarArr[2], // 头像地址
				tagValue: tagArr[1], // node地址
				tagName: tagArr[2], // node名
			};
		});
		return newData.filter((item: any) => {
			return !!item;
		});
	} catch (error) {
		return false;
	}
};
// 节点信息
// 参数（选其一）
// id	节点id
// name	节点名
export const $getNodes = () => {
	http.get('/api/nodes/show.json')
		.then((res: any) => {
			console.log(res);
		})
		.catch((err: any) => {
			console.log(err);
		});
};
// 所有节点
export const $getAllNodes = async () => {
	try {
		const res = await http.get('/api/nodes/all.json');
		return res.data;
	} catch (error) {
		return false;
	}
};
// 根据tag获取主题
// 参数（选其一）
// username		根据用户名取该用户所发表主题
// node_id		根据节点id取该节点下所有主题
// node_name	根据节点名取该节点下所有主题
// id 			根据主题id获取主题详情
export const $getTopicsDetail = async (id: string) => {
	try {
		const res = await http.get('/api/topics/show.json', { params: { id } });
		return res.data[0];
	} catch (error) {
		return false;
	}
};
// 回复
// topic_id	主题id（必选）
// page
// page_size
export const $getTopicReplies = async (id: string) => {
	try {
		const res = await http.get('/api/replies/show.json', {
			params: { topic_id: id },
		});
		return res.data;
	} catch (error) {
		return false;
	}
};
// 用户信息
// username	用户名（必选）
export const $getMembers = () => {
	http.get('/api/members/show.json')
		.then((res: any) => {
			console.log(res);
		})
		.catch((err: any) => {
			console.log(err);
		});
};
