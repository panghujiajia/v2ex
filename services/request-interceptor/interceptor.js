import config from "../../config/config";
export default class Http {
	constructor() {
		this.apiService = config.api;
		this.urlService = config.url;
	}
	request(params) {
		return new Promise((resolve, reject) => {
			const loading = params.loading || true;
			if (loading) {
				wx.showLoading({
					title: "正在加载中...",
					mask: true,
				});
			}
			wx.request({
				url: params.url,
				data: params.data || {},
				timeout: 10000,
				method: params.method || "GET", // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
				header: params.header || {
					"content-type": "application/json",
				},
				complete: function (res) {
					if (res.statusCode === 200) {
						resolve(res.data);
					} else {
						reject(res);
					}
				},
			});
		});
	}
}
