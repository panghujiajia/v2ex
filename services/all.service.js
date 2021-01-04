import http from './request-interceptor/interceptor';
class allService extends http {
    // 获取全部这个tab下的最新内容
    async $getAllTopics() {
        const params = {
            url: `${this.apiService}/topics/latest.json`
        }
        const res = await this.request(params);
        return res;
    };

    // 获取对应tag下的内容
    async $getTagTopics(name) {
        const params = {
            url: `${this.apiService}/topics/show.json?node_name=${name}`
        }
        const res = await this.request(params);
        return res;
    };

    // 获取对应tag下的内容
    async $getTagTopics1(name) {
        const params = {
            url: `${this.urlService}?tab=${name}`
        }
        const res = await this.request(params);
        return res;
    };
}
export default new allService();