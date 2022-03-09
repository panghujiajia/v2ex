<template>
    <view class="container">
        <view>你好，我是一名前端开发。</view>
        <view>
            做这个小程序的目的是方便在移动设备上看帖，同时也给自己在技术上的成长。
        </view>
        <view>如果你觉得做的不错，可以通过下面的打赏码请我喝茶。</view>
        <image
            class="payment-img"
            @click="previewImg(paymentImg)"
            :src="paymentImg"
        >
        </image>
        <view>
            如果你有任何问题、意见想与我交流探讨，你可以通过复制我的
            <text class="link" @click="setClipboard(wechat, 'wechat')">
                微信号
            </text>
            联系我。
        </view>
        <view>
            同时，我也将小程序的
            <text class="link" @click="setClipboard(v2ex, 'github')">
                前端代码
            </text>
            和
            <text class="link" @click="setClipboard(v2exApi, 'github')">
                后端代码
            </text>
            放在了我的github，感兴趣的可以复制链接查看。
        </view>
        <view>希望你也可以给我个star，谢谢！</view>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    name: 'Login'
})
export default class Login extends Vue {
    private paymentImg =
        'https://cdn.todayhub.cn/lib/image/my-payment-code.jpeg';
    private v2ex = 'https://github.com/panghujiajia/v2ex.git';
    private v2exApi = 'https://github.com/panghujiajia/v2ex-api-nestjs.git';
    private wechat = 'GooodTimes';
    private previewImg(url: string) {
        uni.previewImage({
            urls: [url]
        });
    }
    private setClipboard(data: string, type: string) {
        uni.setClipboardData({
            data,
            success: () => {
                uni.showToast({
                    title:
                        type === 'github' ? 'Github地址已复制' : '微信号已复制',
                    icon: 'none'
                });
            }
        });
    }
}
</script>
<style lang="less" scoped>
.container {
    background: #fff;
    padding: 30rpx;
    view {
        font-size: 32rpx;
        color: #666;
        line-height: 50rpx;
        margin-bottom: 20rpx;
    }
    .link {
        color: #0969da;
        font-weight: bold;
        font-size: 34rpx;
        margin: 0 10rpx;
        text-decoration: underline;
    }
    .payment-img {
        width: 500rpx;
        height: 500rpx;
        display: block;
        margin: 30rpx auto;
    }
}
</style>
