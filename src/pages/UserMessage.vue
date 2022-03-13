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
                    <view class="empty-button" @click="getUserMessage()">
                        再试一次
                    </view>
                </view>
                <view v-else class="reload">
                    <image
                        class="empty-img"
                        src="https://img01.yzcdn.cn/vant/empty-image-default.png"
                    >
                    </image>
                    <view class="empty-desc">暂无消息记录</view>
                </view>
            </view>
            <view v-else>
                <view class="list-wrap">
                    <view
                        v-for="(item, index) in list"
                        :key="index"
                        class="item"
                    >
                        <view class="message-info">
                            <text class="message-time">
                                {{ item.last_reply_time }}
                            </text>
                            <view
                                class="message-title"
                                v-if="item.messageType === 'reply'"
                            >
                                <image :src="item.avatar"></image>
                                <text
                                    class="light"
                                    @click="getUserTopic(item.author)"
                                >
                                    {{ item.author }}
                                </text>
                                <text class="gray">在</text>
                                <text
                                    class="light"
                                    @click="getTopicsDetail(item.id)"
                                >
                                    {{ item.title }}
                                </text>
                                <text class="gray">里回复了你</text>
                            </view>
                            <view
                                class="message-title"
                                v-if="item.messageType === 'thanks'"
                            >
                                <image :src="item.avatar"></image>
                                <text
                                    class="light"
                                    @click="getUserTopic(item.author)"
                                >
                                    {{ item.author }}
                                </text>
                                <text class="gray">感谢了你在主题</text>
                                <text class="gray"> › </text>
                                <text
                                    class="light"
                                    @click="getTopicsDetail(item.id)"
                                >
                                    {{ item.title }}
                                </text>
                                <text class="gray">里的回复</text>
                            </view>
                            <view
                                class="message-title"
                                v-if="item.messageType === 'collection'"
                            >
                                <image :src="item.avatar"></image>
                                <text
                                    class="light"
                                    @click="getUserTopic(item.author)"
                                >
                                    {{ item.author }}
                                </text>
                                <text class="gray"> 收藏了你发布的主题 </text>
                                <text class="gray"> › </text>
                                <text
                                    class="light"
                                    @click="getTopicsDetail(item.id)"
                                >
                                    {{ item.title }}
                                </text>
                            </view>
                        </view>
                        <view class="message-content" v-if="item.content">
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
import { $getUserMessage } from '@/services/Common.http';
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
    private saveNotifications!: (data: any) => void;
    private loading = true;
    private noMore = false; // 没有更多了
    private loadFaild = false;
    private loadType = 'refresh'; // 加载类型
    private list: any = [];
    private pageNum = 1; // 页码
    private messageInfo: any = {
        message_count: 0
    };
    private onLoad(option: any) {
        this.saveNotifications(0);
        this.getUserMessage();
    }
    // 点击链接
    private linktap(e: any) {
        const { href, innerText } = e;
        const hrefArr = href.split('/');
        if (hrefArr.length >= 3) {
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
    private async getUserMessage() {
        this.loading = true;
        const list = this.list;
        const res = await $getUserMessage(this.pageNum);
        if (res) {
            const { messageInfo, data } = res;
            this.messageInfo = messageInfo;
            if (this.loadType === 'refresh') {
                this.list = data.map((item: any) => {
                    return {
                        ...item,
                        content:
                            item.content &&
                            item.content.replace(
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
        const { message_count } = this.messageInfo;
        const list = this.list;
        const len = list.length;
        if (len >= message_count) {
            this.noMore = true;
        } else {
            if (len && len < 10) {
                this.pageNum = ++this.pageNum;
                this.loadType = 'loadMore';
                this.getUserMessage();
            }
        }
    }
    // 跳转主题详情
    private getTopicsDetail(id: string) {
        uni.navigateTo({
            url: `/pages/Detail?id=${id}`
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
        this.getUserMessage();
    }
    private onReachBottom() {
        if (this.noMore) {
            return;
        }
        this.pageNum = ++this.pageNum;
        this.loadType = 'loadMore';
        this.getUserMessage();
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
        .message-info {
            .message-time {
                color: #999;
            }
            .message-title {
                margin: 10rpx 0 15rpx;
                line-height: 40rpx;
                image {
                    width: 40rpx;
                    height: 40rpx;
                    border-radius: 8rpx;
                    vertical-align: -11rpx;
                }
                text {
                    margin: 0 10rpx;
                }
            }
        }
        .message-content {
            background: #f9f9f9;
            padding: 0 20rpx;
        }
    }
}
</style>
