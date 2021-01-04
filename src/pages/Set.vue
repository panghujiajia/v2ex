<template>
	<view class="container">
		<view class="header">
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
		</view>
	</view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
	name: 'Set',
})
export default class Set extends Vue {}
</script>
<style lang="less" scoped>
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
