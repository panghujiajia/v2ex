<template>
	<view
		class="user-info"
		:class="[item.beVisited ? 'visited' : '', darkModel ? 'dark' : '']"
	>
		<image class="avatar" :src="item.avatar"></image>
		<view class="info">
			<view class="name-wrap">
				<text class="name">{{ item.author }}</text>
				<view class="node" v-if="item.detail === 'node'">
					<text>{{ item.tag_title }}</text>
				</view>
				<template v-else-if="item.detail === 'floor'">
					<view class="floor-wrap" v-if="!item.isUp">
						<text>{{ item.index }}楼 </text>
					</view>
					<view class="floor-wrap" v-else>
						<text class="up">楼主</text>
						<text class="floor">{{ item.index }}楼</text>
					</view>
				</template>
			</view>
			<view class="time">
				<text class="reply">
					{{ item.last_reply }}
				</text>
				<text v-if="item.reply_num">{{ item.reply_num }} 回复</text>
			</view>
		</view>
	</view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
@Component({
	name: 'User',
})
export default class User extends Vue {
	@State('darkModel') private darkModel!: boolean;
	@Prop()
	private item!: any;
}
</script>
<style lang="less" scoped>
.visited {
	color: #5d5d5d !important;
	image {
		opacity: 0.5;
	}
}
.user-info {
	height: 70rpx;
	display: flex;
	align-items: center;
	.avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 10rpx;
		margin-right: 10rpx;
	}
	.info {
		font-size: 24rpx;
		height: 70rpx;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.name-wrap {
			font-size: 26rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.name {
				font-weight: bold;
				flex: 5;
			}
			.node {
				flex: 2;
				text-align: right;
				text {
					line-height: 40rpx;
					padding: 0 20rpx;
					background: #f2f2f2;
					border-radius: 10rpx;
					font-size: 22rpx;
					height: 40rpx;
					display: inline-block;
					vertical-align: top;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.floor-wrap {
				font-size: 22rpx;
				display: flex;
				text {
					font-weight: bold;
					background: #f2f2f2;
					font-size: 22rpx;
					padding: 0 8rpx;
					border-radius: 5rpx;
					color: #b0b0b0;
				}
				.floor {
					background: #f2f2f2;
					border-radius: 0 5rpx 5rpx 0;
					color: #b0b0b0;
				}
				.up {
					background: #d8d8d8;
					color: #fff;
					border-radius: 5rpx 0 0 5rpx;
				}
			}
		}
		.time {
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #5d5d5d;
			font-size: 22rpx;
			.reply {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 60%;
			}
		}
	}
}
.dark {
	.node {
		text {
			background: #d1d1d1 !important;
			color: #191919 !important;
		}
	}
	.floor-wrap {
		text {
			background: #d1d1d1 !important;
			color: #5d5d5d !important;
		}
		.up {
			background: #adadad !important;
			color: #d1d1d1 !important;
			border-radius: 5rpx 0 0 5rpx;
		}
	}
}
</style>
