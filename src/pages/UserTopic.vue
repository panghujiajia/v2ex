<template>
    <view class="container">
        <template v-if="loading && loadType === 'refresh'">
            <Skeleton type="list"></Skeleton>
        </template>
        <template v-else>
            <view v-if="!list.length" class="load-failed">
                <view v-if="loadFaild" class="reload">
                    <image
                        class="empty-img"
                        src="https://img01.yzcdn.cn/vant/empty-image-error.png"
                    >
                    </image>
                    <view class="empty-desc">加载失败</view>
                    <view class="empty-button" @click="getUserTopics()">
                        再试一次
                    </view>
                </view>
                <view v-else class="reload">
                    <image
                        class="empty-img"
                        src="https://img01.yzcdn.cn/vant/empty-image-default.png"
                    >
                    </image>
                    <view class="empty-desc">暂无主题记录</view>
                </view>
            </view>
            <view v-else>
                <view class="list-wrap">
                    <view
                        v-for="(item, index) in list"
                        :key="index"
                        class="item"
                        @click.stop="getTopicsDetail(item.id)"
                    >
                        <Topic :item="item"></Topic>
                    </view>
                </view>
                <view v-if="noMore" class="noMore"> 没有啦～ </view>
            </view>
        </template>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Topic from '@/components/Topic.vue';
import { $getUserTopics } from '@/services/Common.http';
import Skeleton from '@/components/Skeleton.vue';

@Component({
    name: 'UserTopic',
    components: {
        Topic,
        Skeleton
    }
})
export default class UserTopic extends Vue {
    private loading = true;
    private noMore = false; // 没有更多了
    private loadFaild = false;
    private loadType = 'refresh'; // 加载类型
    private list: any = [];
    private username = '';
    private pageNum = 1; // 页码
    private topicInfo: any = {
        topic_count: 0
    };
    private onLoad(option: any) {
        this.username = option.username;
        uni.setNavigationBarTitle({ title: `${this.username}的主题` });
        this.getUserTopics();
    }
    private async getUserTopics() {
        this.loading = true;
        const list = this.list;
        const res = await $getUserTopics({
            username: this.username,
            p: this.pageNum
        });
        if (res) {
            const { topicInfo, data } = res;
            this.topicInfo = topicInfo;
            if (this.loadType === 'refresh') {
                this.list = data;
                this.loadFaild = false;
                uni.stopPullDownRefresh();
            } else {
                if (!this.noMore) {
                    this.list = [...list, ...data];
                }
            }
            this.isLastPage();
        } else {
            this.loadFaild = true;
        }
        this.loading = false;
    }
    // 判断是否最后一页
    private isLastPage() {
        const { topic_count } = this.topicInfo;
        const list = this.list;
        const len = list.length;
        if (len >= topic_count) {
            this.noMore = true;
        }
    }
    // 跳转主题详情
    private getTopicsDetail(id: string) {
        uni.navigateTo({
            url: `/pages/Detail?id=${id}`
        });
    }
    private onPullDownRefresh() {
        this.pageNum = 1;
        this.loadType = 'refresh';
        this.noMore = false;
        this.getUserTopics();
    }
    private onReachBottom() {
        if (this.noMore) {
            return;
        }
        this.pageNum = ++this.pageNum;
        this.loadType = 'loadMore';
        this.getUserTopics();
    }
}
</script>
<style lang="less" scoped>
.list-wrap {
    background: #f5f5f5;
    border-bottom: 1rpx solid #f5f5f5;
    margin-bottom: 20rpx;
    .item {
        &:last-child {
            /deep/.topic-wrap {
                margin-bottom: 0;
            }
        }
        /deep/.avatar {
            display: none;
        }
    }
}
</style>
