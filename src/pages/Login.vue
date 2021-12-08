<template>
    <view class="container">
        <!--        <input-->
        <!--            :value="username"-->
        <!--            @change="getUsername"-->
        <!--            placeholder="请输入用户名"-->
        <!--        />-->
        <!--        <input-->
        <!--            :value="password"-->
        <!--            @change="getPassword"-->
        <!--            placeholder="请输入密码"-->
        <!--            type="password"-->
        <!--        />-->
        <image class="code" :src="captchaBase64" />
        <input :value="code" @change="getCode" placeholder="请输入验证码" />
        <view class="btn-default" @click="login()">登录</view>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { $getLoginParams, $getUserInfo, $login } from '@/services/Common.http';
import { Mutation, State } from 'vuex-class';
import { TagTime } from '@/types/index.type';
@Component({
    name: 'Login'
})
export default class Login extends Vue {
    @State('username')
    private username!: string;
    @State('cookie')
    private cookie!: string;
    @Mutation('saveCookie')
    private saveCookie!: (cookie: string) => void;
    @Mutation('saveUserInfo')
    private saveUserInfo!: (username: string) => void;
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
    // private username = '';
    // private password = '';
    private created() {
        this.getLoginParams();
        this.getUserInfo();
    }
    private async getUserInfo() {
        const data = await $getUserInfo(this.username);
        console.log(data);
    }
    private async getLoginParams() {
        const data = await $getLoginParams();
        if (data) {
            console.log(data);
            const { codeUrl } = data;
            this.signinData = data;
            this.captchaBase64 =
                'data:image/png;base64,' +
                uni.arrayBufferToBase64(codeUrl.data);
        }
    }
    // 获取输入的验证码
    private getCode(e: any) {
        this.code = e.detail.value;
    }
    // 获取输入的账号
    // private getUsername(e: any) {
    //     this.username = e.detail.value;
    // }
    // // 获取输入的密码
    // private getPassword(e: any) {
    //     this.password = e.detail.value;
    // }
    // 登录请求
    private async login() {
        const { username_key, password_key, code_key, once, cookie } =
            this.signinData;
        const code = this.code;
        // const username = this.username;
        // const password = this.password;
        const params = {
            [username_key]: 'timedivision',
            [password_key]: '123456MM..',
            [code_key]: code,
            cookie,
            once,
            next: '/'
        };
        const data = await $login(params);
        if (data) {
            this.saveCookie(cookie + ';' + data);
            this.saveUserInfo('timedivision');
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
.input {
    height: 80rpx;
    width: 100%;
    border: 2rpx solid #ccc;
}
.code {
    width: 100vw;
    height: 240rpx;
}
</style>
