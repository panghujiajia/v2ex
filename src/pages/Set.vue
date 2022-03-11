<template>
    <view class="container">
        <view v-if="toastTitle" class="toast">{{ toastTitle }}</view>
        <view class="top-wrap">
            <view class="header">
                <view class="header-info">
                    <view class="avatar" @click="showTip()">
                        <image
                            :src="
                                userInfo.avatar ||
                                'https://cdn.todayhub.cn/lib/image/img-user-avatar.png'
                            "
                        />
                    </view>
                    <view class="info">
                        <view>
                            <view class="nick-name" @click="showTip()">
                                {{ userInfo.username || '点击登录' }}
                            </view>
                            <view v-if="cookie" class="rank">
                                {{ userInfo.info || '' }}
                            </view>
                            <view v-if="cookie" class="rank">
                                {{ userInfo.sign_in_day || '' }}
                            </view>
                        </view>
                        <view v-if="cookie" class="money">
                            <template v-if="userInfo.balance">
                                <template
                                    v-for="(item, index) in userInfo.balance"
                                >
                                    <view v-if="item">
                                        <image
                                            :src="`https://cdn.todayhub.cn/lib/image/icon-balance${
                                                userInfo.balance.length - index
                                            }.png`"
                                        ></image>
                                        <text>{{ item }}</text>
                                    </view>
                                </template>
                            </template>
                        </view>
                    </view>
                </view>
                <view v-if="userInfo.is_sign_in" class="btn-sign disabled">
                    已签到
                </view>
                <view v-else class="btn-sign" @click="getSignIn()"> 签到 </view>
            </view>
        </view>
        <view class="cell-group">
            <view
                class="cell van-hairline--bottom"
                @click="navigateTo('history')"
            >
                <view>访问记录</view>
                <view class="icon-arrow"></view>
            </view>
            <view
                class="cell van-hairline--bottom"
                @click="navigateTo('topic', true)"
            >
                <view>我的主题</view>
                <view class="icon-arrow"></view>
            </view>
            <view
                class="cell van-hairline--bottom"
                @click="navigateTo('reply', true)"
            >
                <view>我的回复</view>
                <view class="icon-arrow"></view>
            </view>
            <view
                class="cell van-hairline--bottom"
                @click="navigateTo('message', true)"
            >
                <view>我的消息</view>
                <view class="dot-wrap">
                    <view v-if="notifications" class="dot">
                        {{ notifications }}
                    </view>
                    <view class="icon-arrow"></view>
                </view>
            </view>
            <!--            <view-->
            <!--                class="cell van-hairline&#45;&#45;bottom"-->
            <!--                @click="navigateTo('collect', true)"-->
            <!--            >-->
            <!--                <view>我的收藏</view>-->
            <!--                <view class="icon-arrow"></view>-->
            <!--            </view>-->
            <view class="cell van-hairline--bottom">
                <view>自动签到</view>
                <switch
                    :checked="autoSign"
                    color="#ffc413"
                    style="transform: scale(0.7); margin-right: -30rpx"
                    @change="onAutoSignChange"
                />
            </view>
            <view class="cell van-hairline--bottom">
                <view>
                    <view>站内链接跳转</view>
                    <view class="tip">
                        点击"/t/1024、/go/v2ex"，打开对应帖子、节点
                    </view>
                </view>
                <switch
                    :checked="autoNavigate"
                    color="#ffc413"
                    style="transform: scale(0.7); margin-right: -30rpx"
                    @change="onAutoNavigateChange"
                />
            </view>
            <view class="cell van-hairline--bottom" @click="clearStorage()">
                <view>清空缓存</view>
                <view class="icon-arrow"></view>
            </view>
            <view
                class="cell van-hairline--bottom"
                @click="navigateTo('about')"
            >
                <view>关于</view>
                <view class="icon-arrow"></view>
            </view>
        </view>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter, Mutation, State } from 'vuex-class';

@Component({
    name: 'Set'
})
export default class Set extends Vue {
    @State('autoSign')
    private autoSign!: boolean;
    @State('autoNavigate')
    private autoNavigate!: boolean;
    @State('userInfo')
    private userInfo!: any;
    @State('cookie')
    private cookie!: string;
    @State('notifications')
    private notifications!: number;
    @Getter('toasts')
    private toasts!: any;
    @Mutation('clearHistory')
    private clearHistory!: () => void;
    @Mutation('toggleAutoSign')
    private toggleAutoSign!: (data: boolean) => void;
    @Mutation('toggleAutoNavigate')
    private toggleAutoNavigate!: (data: boolean) => void;
    @Mutation('clearAllStorage')
    private clearAllStorage!: () => void;
    @Action('getUserBalance')
    private getUserBalance!: () => void;
    @Action('getUserInfo')
    private getUserInfo!: () => void;
    @Action('getLoginReward')
    private getLoginReward!: () => void;
    private toastTitle = '';
    private onShow() {
        uni.removeTabBarBadge({
            index: 2
        });
        if (this.cookie) {
            this.getUserBalance();
            if (!this.userInfo.info) {
                this.getUserInfo();
            }
        }
    }
    private onAutoSignChange({ detail }: any) {
        const { value } = detail;
        uni.vibrateShort({});
        if (!this.cookie && value) {
            uni.showToast({
                title: '登录后才能为您自动签到哦！',
                icon: 'none'
            });
        }
        this.toggleAutoSign(value);
    }
    private onAutoNavigateChange({ detail }: any) {
        const { value } = detail;
        uni.vibrateShort({});
        if (!this.cookie && value) {
            uni.showToast({
                title: '登录后才能为您自动签到哦！',
                icon: 'none'
            });
        }
        this.toggleAutoNavigate(value);
    }
    private getSignIn() {
        if (!this.cookie) {
            uni.showToast({
                title: '您需要登录才能进行签到哦！',
                icon: 'none'
            });
            return;
        }
        this.getLoginReward();
    }
    private navigateTo(key: string, auth: boolean = false) {
        if (auth && !this.cookie) {
            uni.showToast({
                title: '您需要登录才能访问哦！',
                icon: 'none'
            });
            return;
        }
        const urlList: any = {
            history: '/pages/History',
            topic: '/pages/UserTopic',
            reply: '/pages/UserReply',
            message: '/pages/UserMessage',
            collect: '/pages/MyCollect',
            about: '/pages/About'
        };
        if (!key) {
            uni.showToast({
                title: '...',
                icon: 'none'
            });
            return;
        }
        const url = urlList[key];
        if (['reply', 'topic'].includes(key)) {
            uni.navigateTo({
                url: `${url}?username=${this.userInfo.username}`
            });
            return;
        }
        uni.navigateTo({ url });
    }
    // 清理缓存
    private clearStorage() {
        const res = uni.getStorageInfoSync();
        const size = res.currentSize;
        if (size <= 1) {
            uni.showToast({
                title: '已经清理干净了',
                icon: 'none'
            });
            return;
        }
        uni.showActionSheet({
            itemList: ['清除访问记录', '清除所有'],
            success: res => {
                const { tapIndex } = res;
                switch (tapIndex) {
                    case 0:
                        this.clearHistory();
                        uni.showToast({
                            title: '清理成功！',
                            icon: 'none'
                        });
                        break;
                    case 1:
                        this.clearAllStorage();
                        uni.clearStorageSync();
                        uni.showToast({
                            title: `清理成功！共为您腾出${size}kb空间！`,
                            icon: 'none'
                        });
                        break;
                    default:
                        break;
                }
            },
            fail: res => {
                console.log(res.errMsg);
            }
        });
    }
    // 点击头像
    private showTip() {
        if (!this.cookie) {
            uni.navigateTo({ url: '/pages/Login' });
            return;
        }
        if (this.toastTitle) {
            return;
        }
        if (this.toasts.length) {
            this.toastTitle =
                this.toasts[Math.round(Math.random() * this.toasts.length)];
            setTimeout(() => {
                this.toastTitle = '';
            }, 5000);
        }
    }
    // #ifdef MP-WEIXIN
    private onShareAppMessage(e: any) {
        return {
            title: 'v2ex',
            path: '/pages/Hot'
        };
    }
    // #endif
}
</script>
<style lang="less" scoped>
.container {
    min-height: 100vh;
    background: #efefef;
    box-sizing: border-box;
    position: relative;
    .toast {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translateX(-310rpx);
        z-index: 99999;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 20rpx;
        padding: 20rpx;
        color: #fff;
        font-size: 28rpx;
        width: 620rpx;
        box-sizing: border-box;
    }
    .top-wrap {
        height: 600rpx;
        background: url(https://cdn.todayhub.cn/lib/image/bg-user-center.png)
            50% no-repeat;
        background-size: 100%;
        .header {
            height: 400rpx;
            width: 690rpx;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .header-info {
                display: flex;
            }
            .avatar {
                width: 180rpx;
                height: 180rpx;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 30rpx;
                image {
                    width: 180rpx;
                    height: 180rpx;
                }
            }
            .info {
                width: 330rpx;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .nick-name {
                    font-size: 40rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    line-height: 56rpx;
                }
                .rank {
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 33rpx;
                    margin: 10rpx 0;
                }
                .money {
                    height: 40rpx;
                    display: flex;
                    align-items: center;
                    margin-top: 30rpx;
                    color: #fff;
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    view {
                        display: flex;
                        align-items: center;
                        margin-right: 15rpx;
                    }
                    image {
                        width: 34rpx;
                        height: 34rpx;
                        margin-right: 5rpx;
                    }
                }
            }
            .btn-sign {
                width: 143rpx;
                height: 51rpx;
                background: #ffc413;
                border-radius: 26rpx;
                font-size: 28rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 51rpx;
                text-align: center;
                &.disabled {
                    background: #c3c3c3;
                }
            }
        }
    }
}
.dot-wrap {
    display: flex;
    align-items: center;
    .dot {
        border-radius: 20rpx;
        padding: 0 16rpx;
        background: #fa5151;
        color: #fff;
        font-size: 22rpx;
        font-weight: bold;
    }
}
.cell-group {
    width: 690rpx;
    margin: 0 auto;
    margin-top: -250rpx;
    border-radius: 16rpx 16rpx 0 0;
    position: relative;
    box-sizing: border-box;
    z-index: 2;
    min-height: calc(100vh - 350rpx);
    .tip {
        color: #999;
        font-size: 22rpx;
    }
}
</style>
