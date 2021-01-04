<template>
	<view>
		<!-- 骨架屏 -->
		<template v-if="type === 'list'">
			<view class="skeleton_list" v-for="item in 10" :key="item">
				<view class="top">
					<view class="flex flex7"></view>
					<view class="flex flex2"></view>
				</view>
				<view class="bottom">
					<view class="avatar"></view>
					<view class="info">
						<view class="name_wrap flex"></view>
						<view class="replys flex"></view>
					</view>
				</view>
			</view>
		</template>
		<template v-if="type === 'detail'">
			<view class="skeleton_detail">
				<view class="bottom">
					<view class="avatar"></view>
					<view class="info">
						<view class="top name_wrap">
							<view class="flex flex7"></view>
							<view class="flex flex2"></view>
						</view>
						<view class="replys flex"></view>
					</view>
				</view>
				<view class="divider"></view>
				<view class="top">
					<view class="flex flex10"></view>
				</view>
				<view class="time flex flex7"></view>
				<view class="line flex flex10"></view>
				<block v-for="item in 6" :key="item">
					<view class="bottom">
						<view class="avatar"></view>
						<view class="info">
							<view class="top name_wrap">
								<view class="flex flex7"></view>
								<view class="flex flex2"></view>
							</view>
							<view class="replys flex"></view>
						</view>
					</view>
					<view class="reply flex flex10"></view>
					<view class="reply flex flex7"></view>
					<view class="reply flex flex9"></view>
				</block>
			</view>
		</template>
	</view>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
	name: 'Skeleton',
})
export default class Skeleton extends Vue {
	@Prop()
	private type!: string;
}
</script>
<style lang="less" scoped>
.top {
	display: flex;
	justify-content: space-between;
	height: 40rpx;
}
.flex {
	background: #f6f7f8;
}
.flex2 {
	width: 20%;
}
.flex7 {
	width: 70%;
}
.flex9 {
	width: 90%;
}
.flex10 {
	width: 100%;
}
.divider {
	height: 2rpx;
	background: #f6f7f8;
	margin: 10rpx auto;
}
.bottom {
	margin-top: 20rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	.avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 10rpx;
		margin-right: 10rpx;
		background: #f6f7f8;
	}
	.info {
		height: 60rpx;
		flex: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.name_wrap,
		.replys {
			height: 30rpx;
			width: 30%;
		}
		.replys {
			width: 45%;
			height: 25rpx;
		}
	}
}
.skeleton_list,
.skeleton_detail {
	padding: 20rpx;
	background: #fff;
}
.skeleton_detail {
	.bottom {
		.info {
			.name_wrap {
				width: 100%;
			}
		}
	}
	.time {
		height: 30rpx;
		margin: 20rpx 0;
	}
	.line {
		height: 15rpx;
		margin: 30rpx 0;
	}
	.reply {
		height: 30rpx;
		margin-top: 20rpx;
	}
}
</style>
