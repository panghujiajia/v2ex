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
                    <view class="empty-button" @click="getUserReplys()">
                        再试一次
                    </view>
                </view>
                <view v-else class="reload">
                    <image
                        class="empty-img"
                        src="https://img01.yzcdn.cn/vant/empty-image-default.png"
                    >
                    </image>
                    <view class="empty-desc">暂无回复记录</view>
                </view>
            </view>
            <view v-else>
                <view class="list-wrap">
                    <view
                        v-for="(item, index) in list"
                        :key="index"
                        class="item"
                    >
                        <view class="reply-info">
                            <text class="reply-time">
                                {{ item.last_reply_time }}
                            </text>
                            <view class="reply-title">
                                <text class="gray">回复了</text>
                                <text
                                    class="light chevron"
                                    @click="getUserTopic(item.author)"
                                >
                                    {{ item.author }}
                                </text>
                                <text class="gray">创建的主题</text>
                                <text class="gray chevron"> › </text>
                                <text class="light" @click="getTags(item)">
                                    {{ item.tag_name }}
                                </text>
                                <text class="gray chevron"> › </text>
                                <text
                                    class="light"
                                    @click="getTopicsDetail(item.id)"
                                >
                                    {{ item.title }}
                                </text>
                            </view>
                        </view>
                        <view class="reply-content">
                            <mp-html
                                :content="item.content"
                                markdown
                                :copyLink="false"
                                selectable
                                @linktap="linktap"
                            />
                        </view>
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
import { $getUserReplys } from '@/services/Common.http';
import Skeleton from '@/components/Skeleton.vue';
import { Mutation, State } from 'vuex-class';

@Component({
    name: 'UserTopic',
    components: {
        Topic,
        Skeleton
    }
})
export default class UserTopic extends Vue {
    @State('autoNavigate')
    private autoNavigate!: boolean;
    @Mutation('saveNotifications')
    private saveNotifications!: () => void;
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
        this.saveNotifications(0);
        this.username = option.username;
        uni.setNavigationBarTitle({ title: `${this.username}的回复` });
        this.getUserReplys();
    }
    // 点击链接
    private linktap(e: any) {
        const { href, innerText } = e;
        const hrefArr = href.split('/');
        if (hrefArr.length >= 3) {
            // 点击 @用户 跳转对应楼层
            if (href.indexOf('/member/') > -1) {
                uni.navigateTo({
                    url: `/pages/UserTopic?username=${innerText}`
                });
                return;
            }
            if (this.autoNavigate) {
                // 链接为主题详情
                if (href.indexOf('/t/') > -1) {
                    const id = href.split('/').pop();
                    uni.navigateTo({
                        url: `/pages/Detail?id=${id}`
                    });
                    return;
                }
                // 链接为节点链接
                if (href.indexOf('/go/') > -1) {
                    const val = href.split('/').pop();
                    uni.navigateTo({
                        url: `/pages/Tag?value=${val}`
                    });
                    return;
                }
            }
        }
        // #ifdef MP-WEIXIN
        uni.setClipboardData({
            data: href,
            success: () => {
                uni.showToast({
                    title: '链接复制成功',
                    icon: 'none'
                });
            }
        });
        // #endif
        // #ifdef APP-PLUS
        plus.runtime.openURL(href);
        // #endif
    }
    private async getUserReplys() {
        this.loading = true;
        const list = this.list;
        const res = await $getUserReplys({
            username: this.username,
            p: this.pageNum
        });
        if (res) {
            const { topicInfo, data } = res;
            this.topicInfo = topicInfo;
            if (this.loadType === 'refresh') {
                this.list = data.map((item: any) => {
                    return {
                        ...item,
                        content: item.content.replace(
                            /(@.*?>)(.*?)(<\/a>)/g,
                            '<text class="user-name">$1$2$3</text>'
                        )
                    };
                });
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
    private getTags(item: any) {
        uni.navigateTo({
            url: `/pages/Tag?value=${item.tag_link}&title=${item.tag_name}`
        });
    }
    private getUserTopic(username: string) {
        uni.navigateTo({
            url: `/pages/UserTopic?username=${username}`
        });
    }
    private onPullDownRefresh() {
        this.pageNum = 1;
        this.loadType = 'refresh';
        this.noMore = false;
        this.getUserReplys();
    }
    private onReachBottom() {
        if (this.noMore) {
            return;
        }
        this.pageNum = ++this.pageNum;
        this.loadType = 'loadMore';
        this.getUserReplys();
    }
}
</script>
<style lang="less" scoped>
.list-wrap {
    background: #f5f5f5;
    border-bottom: 1rpx solid #f5f5f5;
    margin-bottom: 20rpx;
    .item {
        padding: 20rpx;
        font-size: 30rpx;
        background: #fff;
        margin-top: 20rpx;
        /deep/.user-name {
            color: #4474ff;
            view {
                color: #4474ff;
            }
            ._hover {
                text-decoration: none;
            }
        }
        .gray {
            color: #666;
        }
        .light {
            color: #4474ff;
            font-weight: 500;
        }
        .reply-info {
            .reply-time {
                color: #999;
            }
            .reply-title {
                margin: 10rpx 0 15rpx;
                .chevron {
                    margin: 0 10rpx;
                }
            }
        }
        .reply-content {
            background: #f9f9f9;
            padding: 0 20rpx;
        }
    }
}
</style>
