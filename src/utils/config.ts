export default {
	// 所有的主题信息
	reg_item: /<div class="cell(.*?)"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>(.*?)<\/td><\/tr><\/table><\/div>/g,

	// 主题信息 id 回复数 标题
	reg_title: /<span class="item_title"><a href="\/t\/(.*?)#reply(.*?)" class="topic-link">(.*?)<\/a><\/span><div class="sep5"><\/div>/,

	// 作者信息 名 头像
	reg_avatar: /<a href="\/member\/(.*?)"><img src="(.*?)" class="avatar"/g,

	// 节点信息 名 地址
	reg_tag: /<a class="node" href="\/go\/(.*?)">(.*?)<\/a>/g,

	// 主题回复信息（有人回复） 最后回复时间 最后回复人
	reg_repay_1: /<span class="small fade">(.*?)\s\s\u6700\u540e\u56de\u590d\u6765\u81ea\s/,

	// 主题回复信息（没人回复） 最后回复时间
	reg_repay_0: /<span class="small fade"><strong>(.*?)<\/strong>(.*?)<\/span>/,

	// 获取登录接口的key
	reg_login_name: /<input type="(.*?)" class="sl" name="(.*?)" value="" auto/g,

	// 获取once的值
	reg_once: /<input type="hidden" value="(.*?)" name="once" \/>/,
};
