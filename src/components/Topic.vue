<template>
	<view class="topic-wrap" :class="item.beVisited ? 'cur' : ''">
		<view class="title-wrap">
			<text class="title">{{ item.title }}</text>
			<view v-if="item.tagName" class="tag">
				<text>{{ item.tagName }}</text>
			</view>
		</view>
		<User :item="item"></User>
	</view>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import User from './User.vue';
@Component({
	name: 'Topic',
	components: {
		User,
	},
})
export default class Topic extends Vue {
	@Prop()
	private item: any;
}
</script>
<style lang="less" scoped>
.cur {
	color: #adadad !important;
}
.topic-wrap {
	padding: 20rpx;
	border-bottom: 20rpx solid #f9f9f9;
	background: #fff;

	.title-wrap {
		line-height: 40rpx;
		display: flex;
		align-items: flex-start;
		margin-bottom: 10px;

		.title {
			flex: 5;
			padding-right: 20rpx;
			font-weight: bold;
			display: -webkit-box;
			overflow: hidden;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;
			-webkit-line-clamp: 2;
		}

		.tag {
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
	}
}
</style>
