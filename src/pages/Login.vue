<template>
    <view class="container">
        <view class="top">
            <view class="title">
                <view>Hello!</view>
                <view>欢迎使用V2EX mini</view>
            </view>
        </view>
        <view class="cell-group">
            <view class="cell">
                <view class="label">用户名</view>
                <input
                    class="form-item"
                    :value="username"
                    @input="getUsername"
                    placeholder="请输入用户名"
                />
            </view>
            <view class="cell">
                <view class="label">密码</view>
                <input
                    class="form-item"
                    :value="password"
                    @input="getPassword"
                    placeholder="请输入密码"
                    type="password"
                />
            </view>
            <view class="cell code-cell">
                <view class="label">验证码</view>
                <view class="form-item">
                    <input
                        class="form-item"
                        :value="code"
                        @input="getCode"
                        placeholder="请输入验证码"
                    />
                    <image
                        @click="getLoginParams()"
                        class="code"
                        :src="captchaBase64"
                    />
                </view>
            </view>
            <!--            <view @click="getLoginParams()">-->
            <!--                <image class="code" :src="captchaBase64" />-->
            <!--            </view>-->
            <view class="btn-default" @click="login()">登录</view>
        </view>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { $getLoginParams, $login } from '@/services/Common.http';
import { Mutation, State } from 'vuex-class';
@Component({
    name: 'Login'
})
export default class Login extends Vue {
    @State('cookie')
    private cookie!: string;
    @Mutation('saveCookie')
    private saveCookie!: (cookie: string) => void;
    @Mutation('saveUserInfo')
    private saveUserInfo!: (userInfo: any) => void;
    // 登录页面拿的参数
    private signinData = {
        username_key: '',
        password_key: '',
        code_key: '',
        once: '',
        cookie: ''
    };
    // 验证码的base64
    private captchaBase64 = '';
    private code = '';
    private username = '';
    private password = '';
    private created() {
        this.getLoginParams();
    }
    private async getLoginParams() {
        uni.showLoading({
            title: '加载验证码...'
        });
        const data = await $getLoginParams();
        if (data) {
            const { codeUrl } = data;
            this.signinData = data;
            this.captchaBase64 =
                'data:image/png;base64,' +
                uni.arrayBufferToBase64(codeUrl.data);
            console.log(this.captchaBase64);
        } else {
            uni.showToast({
                title: '验证码获取失败，请重试',
                icon: 'none'
            });
            uni.hideLoading();
        }
        uni.hideLoading();
    }
    // 获取输入的验证码
    private getCode(e: any) {
        this.code = e.detail.value;
    }
    // 获取输入的账号
    private getUsername(e: any) {
        this.username = e.detail.value;
    }
    // // 获取输入的密码
    private getPassword(e: any) {
        this.password = e.detail.value;
    }
    // 登录请求
    private async login() {
        const { username_key, password_key, code_key, once, cookie } =
            this.signinData;
        const { username, password, code } = this;
        if (!username) {
            uni.showToast({
                title: '请输入用户名',
                icon: 'none'
            });
            return;
        }
        if (!password) {
            uni.showToast({
                title: '请输入密码',
                icon: 'none'
            });
            return;
        }
        if (!code) {
            uni.showToast({
                title: '请输入验证码',
                icon: 'none'
            });
            return;
        }
        const params = {
            [username_key]: username,
            [password_key]: password,
            [code_key]: code,
            cookie,
            once,
            next: '/'
        };
        uni.showLoading({
            title: '登录中...',
            mask: true
        });
        const data = await $login(params);
        uni.hideLoading();
        if (data) {
            uni.showToast({
                title: '登录成功',
                icon: 'none'
            });
            this.saveCookie(cookie + ';' + data);
            this.saveUserInfo({ username });
            uni.navigateBack({
                delta: 1
            });
        } else {
            uni.showToast({
                title: '登录失败，请重试',
                icon: 'none'
            });
            this.getLoginParams();
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    min-height: 100vh;
    background: #efefef;
    box-sizing: border-box;
    .top {
        height: 661rpx;
        background: url(https://cdn.todayhub.cn/lib/image/bg-user-center.png)
            50% no-repeat;
        background-size: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .title {
            width: 690rpx;
            height: 300rpx;
            line-height: 70rpx;
            color: #fff;
            font-size: 48rpx;
            font-weight: bold;
        }
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
    .cell {
        display: flex;
        align-items: center;
        &.code-cell {
            padding-right: 0;
        }
        .label {
            width: 100rpx;
            padding-right: 36rpx;
            text-align: right;
            color: #33374d;
            font-size: 32rpx;
        }
        .form-item {
            flex: 1;
            font-size: 32rpx;
            display: flex;
            align-items: center;
            input {
                flex: 1;
            }
            .code {
                width: 280rpx;
                height: 100rpx;
            }
        }
    }
    //.code {
    //    width: 100%;
    //    height: 120rpx;
    //}
}
.btn-default {
    width: 660rpx;
    border-radius: 10rpx;
}
</style>
