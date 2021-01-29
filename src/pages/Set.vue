<template>
	<view class="container">
		<!-- <view class="header">
			<view class="avatar">
				<open-data type="userAvatarUrl"></open-data>
			</view>
			<view class="nick-name">
				<open-data type="userNickName" lang="zh_CN"></open-data>
			</view>
		</view>
		<view class="item-list">
			<van-cell title="浏览历史" is-link> </van-cell>
			<van-cell title="缓存设置" is-link> </van-cell>
			<van-cell title="夜间模式" is-link> </van-cell>
			<van-cell title="清空缓存"> </van-cell>
		</view> -->
		<input class="input" type="text" @input="getUsername" />
		<input class="input" type="password" @input="getPassword" />
		<input class="input" type="text" @input="getCode" />
		<image class="code" :src="codeurl" />
		<button @click="login()">登录</button>
	</view>
</template>
<script lang="ts">
import { $login, $getCaptchaBase64, $signin } from '@/services/Common.http';
import { Component, Vue } from 'vue-property-decorator';
import rules from '@/utils/config';
import mpHtml from '@/components/mp-html/mp-html.vue';
@Component({
	name: 'Set',
})
export default class Set extends Vue {
	// 登录页面拿的参数
	private signinData = {
		username_key: '',
		password_key: '',
		code_key: '',
		once: '',
		cookie: '',
	};
	// 验证码的base64
	private captchaBase64 = '';
	private code = '';
	private username = '';
	private password = '';

	private onLoad() {
		// this.signin();
	}
	private getCode(e: any) {
		this.code = e.detail.value;
	}
	private getUsername(e: any) {
		this.username = e.detail.value;
	}
	private getPassword(e: any) {
		this.password = e.detail.value;
	}
	// 登录请求
	private async login() {
		const {
			username_key,
			password_key,
			code_key,
			once,
			cookie,
		} = this.signinData;
		const code = this.code;
		const username = this.username;
		const password = this.password;
		const params = {
			[username_key]: 'timedivision',
			[password_key]: '123456MM..',
			[code_key]: code,
			once: once,
			next: '/',
		};
		const data = await $login(params, cookie);
	}
	// 请求登录页面拿参数
	private async signin() {
		const data = await $signin();
		const { username_key, password_key, code_key, once, cookie } = data;
		this.signinData = { ...data };
		if (!once) {
			return;
		}
		const captchaBase64 = await $getCaptchaBase64(once, cookie);
		this.captchaBase64 = captchaBase64 && (captchaBase64 as string);
	}
}
</script>
<style lang="less" scoped>
.input {
	height: 80rpx;
	width: 80%;
	border: 2rpx solid #ccc;
}
.code {
	width: 400rpx;
	height: 200rpx;
}
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding: 20rpx;
	box-sizing: border-box;
}
.header {
	display: flex;
	flex-direction: column;
	align-items: center;
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}
}
.item-list {
	border-radius: 10rpx;
	overflow: hidden;
}
</style>
