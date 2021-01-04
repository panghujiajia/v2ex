import Request from 'luch-request';
import environments from '../environments';

const http = new Request({
	baseURL: environments.url,
	custom: {
		loading: true, // 是否需要loading
	},
});
http.interceptors.request.use(
	(config: any) => {
		// 可使用async await 做异步操作
		// console.log(config);
		if (config.custom.loading) {
			uni.showLoading({
				title: '正在加载中...',
				mask: true,
			});
		}
		const token = 'xxxx';
		// 判断接口是否需要token
		if (config.custom.auth) {
			if (!token) {
				uni.showToast({
					title: '用户登录信息失效，请重新登录',
					icon: 'none',
				});
				// 如果token不存在，return Promise.reject(config) 会取消本次请求
				return Promise.reject(config);
			}
			config.header.token = token;
		}
		return config;
	},
	(config: any) => {
		// 可使用async await 做异步操作
		uni.hideLoading();
		uni.showToast({
			title: '请求错误，请稍后再试',
			icon: 'none',
		});
		return Promise.reject(config);
	}
);
http.interceptors.response.use(
	(response: any) => {
		uni.hideLoading();
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		// if (response.config.custom.verification) { // 演示自定义参数的作用
		//   return response.data
		// }
		return response;
	},
	(response: any) => {
		uni.hideLoading();
		/*  对响应错误做点什么 （statusCode !== 200）*/
		console.log('error response:', response);
		uni.showToast({
			title: '网络错误，请稍后再试',
			icon: 'none',
		});
		return Promise.reject(response);
	}
);
export default http;
