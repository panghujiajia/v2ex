<template>
	<view class="container" :class="darkModel ? 'dark' : ''">
		<nav-bar :title="'有返回和home'"></nav-bar>
		<view class="top">
			<view class="header">
				<view class="avatar" @click="showTip()">
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view class="nick-name">
					<open-data type="userNickName" lang="zh_CN"></open-data>
				</view>
			</view>
		</view>
		<view class="cell-group">
			<view class="cell van-hairline--bottom" is-link>
				<view>访问记录<text>（最近30条）</text></view>
				<van-icon name="arrow" color="#b3b3b3"></van-icon>
			</view>
			<view class="cell van-hairline--bottom">
				<view>夜间模式</view>
				<van-switch
					size="40rpx"
					:checked="darkModel"
					@change="onSwitchChange"
				/>
			</view>
			<view
				class="cell van-hairline--bottom"
				is-link
				@click="clearStorage()"
			>
				<view>清空缓存</view>
				<van-icon name="arrow" color="#b3b3b3"></van-icon>
			</view>
			<view
				class="cell van-hairline--bottom"
				is-link
				@click="clearStorage()"
			>
				<view>关于</view>
				<van-icon name="arrow" color="#b3b3b3"></van-icon>
			</view>
		</view>
	</view>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import mpHtml from '@/components/mp-html/mp-html.vue';
import { Mutation, State } from 'vuex-class';
import { MixinDark } from '@/mixin/Dark.mixin';
import NavBar from 'taro-navigationbar';

@Component({
	name: 'Set',
})
export default class Set extends Mixins(MixinDark) {
	@Mutation('toggleDarkModel')
	private toggleDarkModel!: (data: boolean) => void;
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
		uni.showActionSheet({
			itemList: ['清除个人设置缓存', '清除访问记录', '清除所有'],
			success(res) {
				console.log(res.tapIndex);
			},
			fail(res) {
				console.log(res.errMsg);
			},
		});
		return;
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
			title: '没有获取你任何信息哦',
			icon: 'none',
		});
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
		background: url(https://ibao-private.oss-cn-shanghai.aliyuncs.com/yunibaoadmin/bg-user-center.png)
			50% no-repeat;
		background-size: 100%;
		position: relative;
		display: flex;
		justify-content: center;
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
	position: absolute;
	bottom: 300rpx;
	.avatar {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		overflow: hidden;
	}
	.nick-name {
		margin-top: 20rpx;
		color: #fff;
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
