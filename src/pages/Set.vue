<template>
	<view class="container" :class="darkModel ? 'dark' : ''">
		<view class="header">
			<view class="avatar" @click="showTip()">
				<open-data type="userAvatarUrl"></open-data>
			</view>
			<view class="nick-name">
				<open-data type="userNickName" lang="zh_CN"></open-data>
			</view>
		</view>
		<view class="cell-group">
			<!-- <view class="cell">
				<view>浏览历史</view>
				<van-icon name="arrow" color="#b3b3b3"></van-icon>
			</view>
			<view class="cell">
				<view>缓存设置</view>
				<van-icon name="arrow" color="#b3b3b3"></van-icon>
			</view> -->
			<view class="cell">
				<view>夜间模式</view>
				<van-switch
					size="40rpx"
					:checked="darkModel"
					@change="onSwitchChange"
				/>
			</view>
			<view class="cell" @click="clearStorage()">
				<view>清空缓存</view>
				<!-- <van-icon name="arrow" color="#b3b3b3"></van-icon> -->
			</view>
		</view>
		<!-- <input class="input" type="text" @input="getUsername" />
		<input class="input" type="password" @input="getPassword" />
		<input class="input" type="text" @input="getCode" />
		<image class="code" :src="captchaBase64" />
		<button @click="login()">登录</button> -->
	</view>
</template>
<script lang="ts">
import { $login, $getCaptchaBase64, $signin } from '@/services/Common.http';
import { Component, Mixins, Vue } from 'vue-property-decorator';
import rules from '@/utils/config';
import mpHtml from '@/components/mp-html/mp-html.vue';
import { Mutation, State } from 'vuex-class';
import { MixinDark } from '@/mixin/Dark.mixin';
@Component({
	name: 'Set',
})
export default class Set extends Mixins(MixinDark) {
	@Mutation('toggleDarkModel') private toggleDarkModel!: (
		data: boolean
	) => void;
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
	// 切换夜间模式
	private onSwitchChange({ detail }: any) {
		// 黑夜模式
		if (detail) {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#191919',
				animation: {
					duration: 200,
					timingFunc: 'easeIn',
				},
			});
			uni.setBackgroundColor({
				backgroundColor: '#191919',
				backgroundColorTop: '#191919',
				backgroundColorBottom: '#191919',
			});
			uni.setTabBarStyle({
				color: '#d2d2d2',
				backgroundColor: '#191919',
				borderStyle: 'white',
			});
			uni.setTabBarItem({
				index: 0,
				iconPath: 'static/icons/top-dark.png',
			});
			uni.setTabBarItem({
				index: 1,
				iconPath: 'static/icons/all-dark.png',
			});
			uni.setTabBarItem({
				index: 2,
				iconPath: 'static/icons/user-dark.png',
			});
		} else {
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#ffffff',
				animation: {
					duration: 200,
					timingFunc: 'easeIn',
				},
			});
			uni.setBackgroundColor({
				backgroundColor: '#ffffff',
				backgroundColorTop: '#ffffff',
				backgroundColorBottom: '#ffffff',
			});
			uni.setTabBarStyle({
				color: '#191919',
				backgroundColor: '#ffffff',
				borderStyle: 'black',
			});
			uni.setTabBarItem({
				index: 0,
				iconPath: 'static/icons/top-bright.png',
			});
			uni.setTabBarItem({
				index: 1,
				iconPath: 'static/icons/all-bright.png',
			});
			uni.setTabBarItem({
				index: 2,
				iconPath: 'static/icons/user-bright.png',
			});
		}
		this.toggleDarkModel(detail);
	}
	// 清理缓存
	private clearStorage() {
		try {
			const res = uni.getStorageInfoSync();
			const size = res.currentSize;
			if (size <= 1) {
				uni.showToast({
					title: '已经清理干净了',
					icon: 'none',
				});
				return;
			}
			uni.clearStorageSync();
			uni.showToast({
				title: `清理成功！共为您腾出${size}kb空间！`,
				icon: 'none',
			});
		} catch (error) {
			uni.showToast({
				title: '清理失败，请稍后再试',
				icon: 'none',
			});
		}
	}
	// 点击头像
	private showTip() {
		uni.showToast({
			title: '没有任何信息',
			icon: 'none',
		});
	}
	// 获取输入的验证码
	private getCode(e: any) {
		this.code = e.detail.value;
	}
	// 获取输入的账号
	private getUsername(e: any) {
		this.username = e.detail.value;
	}
	// 获取输入的密码
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
		console.log(data);
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
	box-sizing: border-box;
}
.header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 0;
	margin-bottom: 20rpx;
	background: #fff;
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		overflow: hidden;
	}
	.nick-name {
		margin-top: 20rpx;
	}
}
.dark {
	background: #111111;
	.header {
		background: #191919;
		.nick-name {
			color: #d1d1d1;
		}
	}
	.cell-group {
		background: #191919;
		.cell {
			color: #d1d1d1;
			border-bottom-color: #242424;
		}
	}
}
</style>
