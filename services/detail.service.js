import http from './request-interceptor/interceptor';
class detailService extends http {
  // 获取主题详情
  async $getTopicsDetail(id) {
    const params = {
      url: `${this.apiService}/topics/show.json?id=${id}`
    }
    const res = await this.request(params);
    return res;
  };

  // 获取主题回复
  async $getTopicsReplies(id) {
    const params = {
      url: `${this.apiService}/replies/show.json?topic_id=${id}`
    }
    const res = await this.request(params);
    return res;
  };
}
export default new detailService();