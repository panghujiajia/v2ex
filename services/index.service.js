import http from './request-interceptor/interceptor';
class indexService extends http {
    // 获取热门列表
    async $getHotList() {
        const params = {
            url: `${this.apiService}/topics/hot.json`
        }
        const res = await this.request(params);
        return res;
    };
}
export default new indexService();