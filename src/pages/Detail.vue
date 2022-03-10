<template>
    <view class="container">
        <template v-if="loading && loadType === 'refresh'">
            <Skeleton type="list"></Skeleton>
        </template>
        <template v-else>
            <view v-if="!topicsDetail.title" class="load-failed">
                <view class="reload">
                    <view class="reload">
                        <image
                            class="empty-img"
                            src="https://img01.yzcdn.cn/vant/empty-image-error.png"
                        >
                        </image>
                        <view class="empty-desc">加载失败</view>
                        <view class="empty-button" @click="loadData(true)">
                            再试一次
                        </view>
                    </view>
                </view>
            </view>
            <template v-else>
                <view class="topic-wrap topic-header">
                    <view class="user-info">
                        <view class="user">
                            <image
                                class="avatar"
                                :src="topicsDetail.avatar"
                            ></image>
                            <text
                                class="name"
                                @click="getUserTopic(topicsDetail.author)"
                            >
                                {{ topicsDetail.author }}
                            </text>
                            <text class="time">
                                {{ topicsDetail.publish_time }}
                            </text>
                        </view>
                    </view>
                    <view class="title">{{ topicsDetail.title }}</view>
                    <view v-if="topicsDetail.content" class="content">
                        <mp-html
                            :content="topicsDetail.content"
                            markdown
                            :copyLink="false"
                            selectable
                            @linktap="linktap"
                        />
                    </view>
                </view>
                <view
                    v-if="topicsDetail.subtle_list.length"
                    class="subtle-wrap"
                >
                    <template v-for="(item, index) in topicsDetail.subtle_list">
                        <view class="title">
                            第{{ index + 1 }}条附言 {{ item.time }}
                        </view>
                        <view :key="index" class="content">
                            <mp-html
                                :content="item.content"
                                markdown
                                :copyLink="false"
                                selectable
                                @linktap="linktap"
                            />
                        </view>
                    </template>
                </view>
                <view class="tag-info">
                    <view class="tag">
                        <view @click="getTags(topicsDetail)">
                            <text class="tag-symbol">#</text>
                            <text>{{ topicsDetail.tag_name }}</text>
                        </view>
                    </view>
                    <view class="floor-wrap">
                        <image
                            class="reply-icon"
                            src="https://cdn.todayhub.cn/lib/image/reply_neue.png"
                            @click="replyTopic()"
                        ></image>
                        <view class="floor">OP</view>
                    </view>
                </view>
                <view v-if="topicsDetail.reply_num" class="reply-num">
                    {{ topicsDetail.reply_num }}条回复
                </view>
                <view
                    v-if="lastScrollTop"
                    class="back-top-last-scroll"
                    @click="backToLastScroll()"
                >
                    回到现在
                </view>
                <view
                    v-for="(item, index) in topicsDetail.reply_list"
                    :key="index"
                    :class="item.author"
                    class="topic-wrap topic-reply"
                >
                    <view class="user-info">
                        <view class="user">
                            <image class="avatar" :src="item.avatar"></image>
                            <text
                                class="name"
                                @click="getUserTopic(item.author)"
                            >
                                {{ item.author }}
                            </text>
                            <text v-if="item.is_master" class="op">OP</text>
                            <text class="time">
                                {{ item.reply_time }}
                            </text>
                            <template v-if="item.like_num">
                                <image
                                    class="like-icon"
                                    src="https://cdn.todayhub.cn/lib/image/like_num.png"
                                ></image>
                                <text class="like-num">
                                    {{ item.like_num }}
                                </text>
                            </template>
                        </view>
                        <view class="floor-wrap">
                            <image
                                class="reply-icon"
                                src="https://cdn.todayhub.cn/lib/image/reply_neue.png"
                                @click="replyTopic(item)"
                            ></image>
                            <view class="floor">
                                {{ `${index + 1}楼` }}
                            </view>
                        </view>
                    </view>
                    <mp-html
                        :content="item.content"
                        markdown
                        :copyLink="false"
                        selectable
                        @linktap="linktap"
                    />
                </view>
                <view class="reply-wrap" v-if="replyBox">
                    <textarea
                        class="textarea"
                        fixed
                        :maxlength="-1"
                        placeholder="请输入内容"
                        placeholder-style="font-size: 28rpx;color: #999;"
                        :show-confirm-bar="false"
                        :value="content"
                        :hold-keyboard="true"
                        auto-focus
                        @input="onInputChange"
                    />
                    <view class="tip">
                        <view>请尽量让自己的回复能够对别人有帮助</view>
                        <view>若提交失败请尝试重新登录</view>
                    </view>
                    <view class="btn-wrap">
                        <view
                            class="reply-btn cancel-btn"
                            @click="cancelReply()"
                        >
                            取消
                        </view>
                        <view class="reply-btn" @click="confirmReply()">
                            提交
                        </view>
                    </view>
                </view>
                <!-- #ifdef MP-WEIXIN -->
                <ad unit-id="adunit-6996f541fca34984"></ad>
                <!-- #endif -->
                <view v-if="noMore" class="noMore">
                    没有更多了，看看别的主题吧～
                </view>
            </template>
        </template>
    </view>
</template>

<script lang="ts">
import { $getTopicDetail, $replyTopic } from '@/services/Common.http';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear'; // 导入插件
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Skeleton from '@/components/Skeleton.vue';
import { Mutation, State } from 'vuex-class';

dayjs.extend(isLeapYear); // 使用插件
dayjs.locale('zh-cn'); // 使用本地化语言
@Component({
    name: 'Detail',
    components: {
        Skeleton
    }
})
export default class Detail extends Vue {
    @State('cookie')
    private cookie!: string;
    @State('autoNavigate')
    private autoNavigate!: boolean;
    @Mutation('saveHistoryTopics')
    private saveHistoryTopics!: (data: any) => void;
    private topicsDetail: any = {}; // 主题详情
    private params: any = {};
    private loading = true;
    private noMore = false; // 没有更多了
    private pageNum = 1; // 页码
    private page = 1; // 总页码
    private loadType = 'refresh'; // 加载类型
    private scrollTop = 0;
    private lastScrollTop = 0;
    private replyBox = false;
    private content = '';
    private onLoad(options: any) {
        this.params = options;
        this.loadData();
    }
    // private onKeyboardChange(e: any) {
    //     const {
    //         detail: { height }
    //     } = e;
    //     if (height) {
    //         this.replyBox = true;
    //     } else {
    //         this.replyBox = false;
    //         this.content = '';
    //     }
    // }
    private onInputChange(e: any) {
        const {
            detail: { value }
        } = e;
        this.content = value;
    }
    private async confirmReply() {
        const { once, id } = this.topicsDetail;
        const content = this.content;
        if (!content) {
            uni.showToast({
                title: '回复内容不能为空',
                icon: 'none'
            });
            return;
        }
        const params = {
            once,
            id,
            content: this.content
        };
        const data = await $replyTopic(params);
        if (data) {
            this.replyBox = false;
            this.content = '';
            this.pageNum = 1;
            this.loadType = 'loadMore';
            this.noMore = false;
            await this.loadData();
            uni.pageScrollTo({
                scrollTop: 999999
            });
        } else {
            uni.showToast({
                title: '回复失败，请重试',
                icon: 'none'
            });
        }
    }
    private cancelReply() {
        this.replyBox = false;
        this.content = '';
    }
    private replyTopic(item?: any) {
        if (!this.cookie) {
            uni.showModal({
                title: '提示',
                content: '登录后才能回帖',
                confirmText: '去登录',
                cancelText: '算了',
                success: ({ confirm }) => {
                    if (confirm) {
                        uni.navigateTo({ url: '/pages/Login' });
                    }
                }
            });
            return;
        }
        if (item) {
            const { author } = item;
            this.content = this.content
                ? `${this.content}\n@${author} `
                : `@${author} `;
        }
        this.replyBox = true;
    }
    private getUserTopic(username: string) {
        uni.navigateTo({
            url: `/pages/UserTopic?username=${username}`
        });
    }
    //回到上次浏览位置
    private backToLastScroll() {
        uni.pageScrollTo({
            scrollTop: this.lastScrollTop,
            success: () => {
                this.lastScrollTop = 0;
            }
        });
    }
    // 点击链接
    private linktap(e: any) {
        const { href, innerText } = e;
        const hrefArr = href.split('/');
        if (hrefArr.length >= 3) {
            // 点击 @用户 跳转对应楼层
            if (href.indexOf('/member/') > -1) {
                this.lastScrollTop = this.scrollTop;
                const query = uni.createSelectorQuery().in(this);
                query
                    .select(`.${innerText}`)
                    .boundingClientRect(data => {
                        uni.pageScrollTo({
                            scrollTop: this.scrollTop + data.top
                        });
                    })
                    .exec();
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
    // 跳转tag
    private getTags(tag: any) {
        uni.navigateTo({
            url: `/pages/Tag?value=${tag.tag_link}&title=${tag.tag_name}`
        });
    }
    private resetLoading() {
        this.loading = false;
    }
    // 加载数据
    private async loadData() {
        this.loading = true;
        const replyList = this.topicsDetail.reply_list || [];
        const params = this.params;
        const res = await $getTopicDetail({
            id: params.id,
            p: this.pageNum
        });
        if (res) {
            let { reply_list, page, once } = res;
            if (this.pageNum === 1) {
                this.topicsDetail = res;
                uni.setNavigationBarTitle({ title: this.topicsDetail.title });
                this.page = page || 1;
                this.saveHistoryTopics(res);
            }
            this.topicsDetail.once = once;
            reply_list = reply_list.map((item: any) => {
                return {
                    ...item,
                    content: item.content.replace(
                        /(@.*?>)(.*?)(<\/a>)/g,
                        '<text class="user-name">$1$2$3</text>'
                    )
                };
            });
            if (this.loadType === 'refresh') {
                this.topicsDetail.reply_list = reply_list;
                uni.stopPullDownRefresh();
            } else {
                if (!this.noMore) {
                    this.topicsDetail.reply_list = [
                        ...replyList,
                        ...reply_list
                    ];
                }
            }
            this.isLastPage();
        }
        this.resetLoading();
    }
    // 判断是否最后一页
    private isLastPage() {
        if (this.pageNum >= this.page) {
            this.noMore = true;
        }
    }
    private onPageScroll(e: any) {
        this.scrollTop = e.scrollTop;
    }
    private onPullDownRefresh() {
        this.pageNum = 1;
        this.loadType = 'refresh';
        this.loadData();
    }
    private onReachBottom() {
        if (this.pageNum === this.page) {
            return;
        }
        this.pageNum = ++this.pageNum;
        this.loadType = 'loadMore';
        this.loadData();
    }
    // #ifdef MP-WEIXIN
    private onShareAppMessage(e: any) {
        const { id } = this.params;
        return {
            title: 'v2ex',
            path: `/pages/Detail?id=${id}`
        };
    }
    // #endif
}
</script>

<style lang="less" scoped>
.container {
    padding-bottom: 60rpx;
}
text {
    user-select: text;
}
.load-failed {
    padding-top: 150rpx;
}
.bottom-button {
    /deep/.van-button--round {
        padding: 0 50rpx !important;
    }
}
.subtle-wrap {
    background: #fffff9;
    color: #666;
    .title {
        font-size: 24rpx;
        padding: 25rpx 30rpx 0;
        border-top: 2rpx solid #f5f5f5;
    }
    .content {
        padding: 0 30rpx;
    }
}
.reply-btn {
    padding: 0 20rpx;
    height: 50rpx;
    text-align: center;
    line-height: 50rpx;
    background: #4474ff;
    color: #fff;
    font-size: 28rpx;
    border-radius: 8rpx;
}
.reply-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 400rpx;
    padding: 20rpx;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 0 20rpx #dedede;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    .textarea {
        background: #fff;
        width: 100%;
        flex: 1;
        border: 1rpx solid #dedede;
        margin-bottom: 10rpx;
        padding: 10rpx;
        box-sizing: border-box;
    }
    .tip {
        font-size: 26rpx;
        color: #999;
        margin-bottom: 10rpx;
    }
    .btn-wrap {
        align-self: flex-end;
    }
    .reply-btn {
        display: inline-block;
        padding: 0 20rpx;
        height: 50rpx;
        text-align: center;
        line-height: 50rpx;
        background: #4474ff;
        color: #fff;
        font-size: 28rpx;
        border-radius: 8rpx;
    }
    .cancel-btn {
        background: #efefef;
        color: #999;
        margin-right: 20rpx;
    }
}
.topic-wrap {
    padding: 25rpx 30rpx 0;
    background: #fff;
    /deep/.user-name {
        color: #4474ff;
        view {
            color: #4474ff;
        }
        ._hover {
            text-decoration: none;
        }
    }
    .user-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40rpx;
        margin-bottom: 20rpx;
        .user {
            display: flex;
            align-items: center;
            .avatar {
                width: 40rpx;
                height: 40rpx;
                margin-right: 14rpx;
                border-radius: 8rpx;
            }
        }
        .like-icon {
            width: 20rpx;
            height: 20rpx;
            margin-left: 10rpx;
            margin-right: 5rpx;
        }
        .like-num {
            font-size: 22rpx;
            color: #999;
            font-weight: 400;
        }
        .op {
            border: 2rpx solid #1484cd;
            color: #1484cd;
            font-size: 20rpx;
            border-radius: 7rpx;
            font-weight: 500;
            padding: 5rpx;
            line-height: 16rpx;
            margin-left: 10rpx;
        }
        .name {
            font-size: 28rpx;
            color: #666;
            font-weight: 500;
        }
        .time {
            font-size: 22rpx;
            color: #999;
            font-weight: 400;
            margin-left: 20rpx;
        }
    }
    .title {
        font-size: 32rpx;
        color: #333;
        line-height: 45rpx;
        font-weight: 500;
        margin-bottom: 20rpx;
    }
}
.back-top-last-scroll {
    position: fixed;
    z-index: 99;
    right: 50rpx;
    bottom: 280rpx;
    border-radius: 8rpx;
    padding: 10rpx 14rpx;
    box-shadow: 0 0 10rpx #ccc;
    font-size: 26rpx;
    background: #fff;
}
.tag-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25rpx 30rpx;
    background: #fff;
    .tag {
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        color: #333;
        font-size: 24rpx;
        font-weight: 400;
        view {
            background: #f6f6f6;
            padding: 0 20rpx;
            border-radius: 25rpx;
        }
        .tag-symbol {
            color: #4474ff;
            font-size: 24rpx;
            margin-right: 5rpx;
        }
    }
}
.floor-wrap {
    display: flex;
    align-items: center;
    .reply-icon {
        width: 30rpx;
        height: 30rpx;
        margin-right: 15rpx;
    }
    .floor {
        color: #999;
        font-size: 22rpx;
    }
}
.reply-num {
    height: 50rpx;
    line-height: 50rpx;
    padding: 0 30rpx;
    background: #f5f5f5;
    color: #999;
    font-size: 22rpx;
    font-weight: 400;
}
.topic-header {
    //border-top: 20rpx solid #f5f5f5;
}
.topic-reply {
    padding-bottom: 0;
    border-bottom: 20rpx solid #f5f5f5;
    /deep/rich-text {
        font-weight: 500;
    }
    .user-info {
        margin-bottom: 0;
    }
}
</style>
