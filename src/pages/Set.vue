<template>
    <view class="container">
        <div class="top-bg">
            <view class="top">
                <view class="header" @click="showTip()">
                    <view class="avatar">
                        <image
                            :src="
                                (cookie && userInfo.avatar) ||
                                'https://cdn.todayhub.cn/lib/image/img-user-avatar.png'
                            "
                        />
                    </view>
                    <view class="nick-name">
                        <view>
                            {{ userInfo.username || '点击登录' }}
                        </view>
                    </view>
                    <view class="nick-name rank" v-if="userInfo.info">
                        <view>
                            {{ userInfo.info.split('，')[0] || '' }}
                        </view>
                    </view>
                    <view class="nick-name rank" v-if="userInfo.sign_in_day">
                        <view>
                            {{ userInfo.sign_in_day || '' }}
                        </view>
                    </view>
                    <view class="btn-sign" v-if="userInfo.is_sign_in">
                        已签到
                    </view>
                    <view class="btn-sign" v-else>签到</view>
                </view>
            </view>
        </div>
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
                @click="navigateTo('collect', true)"
            >
                <view>我的收藏</view>
                <view class="icon-arrow"></view>
            </view>
            <!-- <view class="cell van-hairline--bottom">
				<view>广告开关</view>
				<van-switch
					size="40rpx"
					:checked="adSwitch"
					@change="onSwitchChange"
				/>
			</view> -->
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
import { Mutation, State } from 'vuex-class';
import {
    $getLoginReward,
    $getLoginRewardInfo,
    $getUserInfo
} from '@/services/Common.http';

@Component({
    name: 'Set'
})
export default class Set extends Vue {
    @State('adSwitch')
    private adSwitch!: boolean;
    @State('userInfo')
    private userInfo!: any;
    @State('cookie')
    private cookie!: string;
    @Mutation('saveAdCloseTime')
    private saveAdCloseTime!: () => void;
    @Mutation('clearHistory')
    private clearHistory!: () => void;
    @Mutation('toggleAdSwitch')
    private toggleAdSwitch!: (data: boolean) => void;
    @Mutation('saveUserInfo')
    private saveUserInfo!: (userInfo: any) => void;
    @Mutation('clearAllStorage')
    private clearAllStorage!: () => void;
    private onShow() {
        if (this.cookie) {
            this.getLoginRewardInfo();
            if (!this.userInfo.info) {
                this.getUserInfo();
            }
        }
    }
    private async getLoginRewardInfo() {
        const data = await $getLoginRewardInfo();
        if (data) {
            const { is_sign_in } = data;
            if (!is_sign_in) {
                await this.getLoginReward();
                return;
            }
            this.saveUserInfo(data);
        }
    }
    private async getLoginReward() {
        const data = await $getLoginReward();
        if (data) {
            const { sign_in_day } = data;
            uni.showToast({
                title: `签到成功，${sign_in_day}`,
                icon: 'none'
            });
            this.saveUserInfo(data);
        }
    }
    private async getUserInfo() {
        const data = await $getUserInfo(this.userInfo.username);
        if (data) {
            this.saveUserInfo(data);
        }
    }
    private onSwitchChange({ detail }: any) {
        this.toggleAdSwitch(detail);
        if (!detail) {
            this.saveAdCloseTime();
            uni.showToast({
                title: '关闭成功，本周将不会显示广告',
                icon: 'none'
            });
            return;
        }
        uni.showToast({
            title: '开启成功，感谢您愿意打开广告',
            icon: 'none'
        });
    }
    private navigateTo(key: string, auth: boolean = false) {
        if (auth && !this.cookie) {
            uni.showToast({
                title: '请先登录',
                icon: 'none'
            });
            return;
        }
        const urlList: any = {
            history: '/pages/History',
            topic: '/pages/UserTopic',
            reply: '/pages/UserReply',
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
                        this.toggleAdSwitch(true);
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
        uni.showToast({
            title: ' 我宁可呼吸到她散发在空气中的发香，轻吻她的双唇，抚摸她的双手，而放弃永生。——《天使之城》',
            icon: 'none'
        });
    }
    // #ifdef MP-WEIXIN
    private onShareAppMessage(e: any) {
        return {
            title: 'v2ex mini',
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
    .top-bg {
        height: 661rpx;
        background: url(https://cdn.todayhub.cn/lib/image/bg-user-center.png)
            50% no-repeat;
        background-size: 100%;
        .top {
            height: 461rpx;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .title {
            height: 80rpx;
            line-height: 80rpx;
            color: #fff;
            font-weight: bold;
        }
    }
}
.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    .avatar {
        width: 200rpx;
        height: 200rpx;
        border-radius: 50%;
        overflow: hidden;
        image {
            width: 200rpx;
            height: 200rpx;
        }
    }
    .nick-name {
        margin-top: 20rpx;
        color: #fff;
        font-size: 36rpx;
    }
    .rank {
        font-size: 24rpx;
    }
    .btn-sign {
        padding: 10rpx 15rpx;
        background: #999999;
        color: #fff;
        border-radius: 10rpx;
        font-size: 24rpx;
    }
}
.cell-group {
    width: 690rpx;
    margin: 0 auto;
    margin-top: -200rpx;
    border-radius: 16rpx 16rpx 0 0;
    position: relative;
    box-sizing: border-box;
    z-index: 2;
    min-height: calc(100vh - 461rpx);
}
</style>
