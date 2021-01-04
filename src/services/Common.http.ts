import http from './index';

// 最热
export const $getHotList = async () => {
	try {
		const res = await http.get('/api/topics/hot.json');
		return res.data;
	} catch (error) {
		return false;
	}
};
// 获取节点下的所有帖子，带分页
export const $getTagTopics = async (params: any) => {
	try {
		const res = await http.get(`/go/${params.value}?p=${params.pageNum}`);
		return res.data;
	} catch (error) {
		return false;
	}
};
// '全部'
export const $getAllTopics = async (params: string) => {
	try {
		const res = await http.get(`?tab=${params}`);
		return res.data;
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
