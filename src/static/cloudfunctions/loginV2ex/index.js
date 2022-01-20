// 云函数入口文件
const cloud = require('wx-server-sdk');
var rp = require('request-promise');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
	console.log(event);
	console.log(context);
	const { cookie, userInfo, ...rest } = event;
	console.log(rest);
	var res = await rp('https://www.v2ex.com/signin', rest, {
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
			cookie,
			origin: 'https://www.v2ex.com',
			referer: 'https://www.v2ex.com/signin',
		},
	});
	console.log('res', res);
	const wxContext = cloud.getWXContext();

	return {
		event,
		// openid: wxContext.OPENID,
		// appid: wxContext.APPID,
		// unionid: wxContext.UNIONID,
		res,
	};
};
