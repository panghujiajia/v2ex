<template>
	<view>
		<view class="search-box">
			<van-search
				:value="value"
				:show-action="isFocus"
				@focus="getFocus()"
				@cancel="getCancel()"
				@blur="getCancel()"
				placeholder="请输入节点关键词"
			/>
		</view>
		<view class="result" v-if="value || isFocus"></view>
		<view class="tag-wrap" v-else>
			<view v-for="key in Object.keys(tagNavs)" :key="key">
				<view class="title">{{ key }}</view>
				<view
					class="tag"
					v-for="item in tagNavs[key]"
					:key="item.value"
					@click="getTags(item)"
				>
					{{ item.title }}
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { $getAllNodes, $getAllTopics } from '@/services/Common.http';
import { Mutation, State } from 'vuex-class';
import rules from '@/utils/config';
import tagNavs from '@/config/tagNav.config';
@Component({
	name: 'Find',
})
export default class Find extends Vue {
	private tagNavs = tagNavs;
	private value = ''; // 搜索关键词
	private isFocus = false; // 是否聚焦
	private onLoad() {}
	private getFocus() {
		this.isFocus = true;
	}
	private getCancel() {
		this.value = '';
		this.isFocus = false;
	}
	private getTags(item: any) {
		uni.navigateTo({
			url: `/pages/Tag?value=${item.value}&title=${item.title}`,
		});
	}
}
</script>

<style lang="less" scoped>
.search-box {
	border-bottom: 10rpx solid #f5f5f5;
}
.result {
	min-height: calc(100vh - 118rpx);
	background: #fff;
}
.tag-wrap {
	padding: 20rpx;
	.title {
		line-height: 80rpx;
		margin-bottom: 20rpx;
	}
	.tag {
		line-height: 60rpx;
		padding: 0 20rpx;
		background: #f2f2f2;
		border-radius: 10rpx;
		font-size: 22rpx;
		height: 60rpx;
		display: inline-block;
		vertical-align: top;
		margin: 0 20rpx 20rpx 0;
	}
}
</style>
