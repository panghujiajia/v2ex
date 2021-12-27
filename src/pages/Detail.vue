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
                            <!--                            <image :src="item.avatar"></image>-->
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
                        <view class="floor">
                            {{ `${index + 1}楼` }}
                        </view>
                    </view>
                    <mp-html
                        :content="item.content"
                        markdown
                        selectable
                        @linktap="linktap"
                    />
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
import { $getTopicDetail } from '@/services/Common.http';
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
    private onLoad(options: any) {
        this.params = options;
        this.loadData();
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
				query.select(`.${innerText}`).boundingClientRect(data => {
					uni.pageScrollTo({
						scrollTop: this.scrollTop + data.top
					});
				}).exec();
                return;
            }
            if (!this.autoNavigate) {
                return;
            }
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
            }
        }
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
            let { reply_list, page } = res;
            if (this.pageNum === 1) {
                this.topicsDetail = res;
                this.page = page || 1;
                this.saveHistoryTopics(res);
            }
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
            title: 'v2ex mini',
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
    .reply {
        color: #999;
        font-size: 22rpx;
    }
}
.floor {
    color: #999;
    font-size: 22rpx;
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
