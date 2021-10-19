<template>
	<view class="container">
		<template v-if="loading">
			<Skeleton type="list"></Skeleton>
		</template>
		<template v-else>
			<view class="load-failed" v-if="loadFailedTime > 0">
				<view class="reload">
					<van-empty image="error" description="加载失败">
						<van-button
							round
							type="info"
							class="bottom-button"
							@click="loadData(true)"
						>
							再试一次
						</van-button>
					</van-empty>
				</view>
				<!-- <view class="quit" v-else>
					<van-empty
						image="network"
						description="抱歉，暂时连不上服务器"
					>
						<navigator target="miniProgram" open-type="exit">
							<van-button round type="info" class="bottom-button">
								等会再来
							</van-button>
						</navigator>
					</van-empty>
				</view> -->
			</view>
			<template v-else>
				<view class="topic-wrap topic-header">
					<view class="user-info">
						<view class="user">
							<text class="name">{{ topicsDetail.author }}</text>
							<text class="time">
								{{ topicsDetail.last_reply }}
							</text>
						</view>
					</view>
					<view class="title">{{ topicsDetail.title }}</view>
					<view class="content" v-if="topicsDetail.data">
						<mp-html
							:content="topicsDetail.data"
							markdown
							selectable
						/>
					</view>
					<view class="tag-info">
						<view class="tag">
							<view>
								<text class="tag-symbol">#</text>
								<text>{{ topicsDetail.tab_name }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="reply-num">
					{{ topicsReplies.length }}条回复
				</view>
				<view
					class="topic-wrap topic-reply"
					v-for="(item, index) in topicsReplies"
					:key="index"
				>
					<view class="user-info">
						<view class="user">
							<text class="name">{{ item.user.author }}</text>
							<text class="time">
								{{ item.user.last_reply }}
							</text>
						</view>
						<view class="floor">
							{{
								item.user.is_master
									? '楼主'
									: `${item.user.index}楼`
							}}
						</view>
					</view>
					<mp-html :content="item.content" markdown selectable />
				</view>
				<ad unit-id="adunit-6996f541fca34984"></ad>
			</template>
		</template>
	</view>
</template>

<script lang="ts">
import { $getTopicDetail } from '@/services/Common.http';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear'; // 导入插件
import 'dayjs/locale/zh-cn'; // 导入本地化语言
dayjs.extend(isLeapYear); // 使用插件
dayjs.locale('zh-cn'); // 使用本地化语言

import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Skeleton from '@/components/Skeleton.vue';
import mpHtml from '@/components/mp-html/mp-html.vue';
import { Mutation } from 'vuex-class';
@Component({
	name: 'Detail',
	components: {
		Skeleton,
	},
})
export default class Detail extends Vue {
	@Mutation('saveHistoryTopics')
	private saveHistoryTopics!: (data: any) => void;
	private topicsDetail: any = {}; // 主题详情
	private topicsReplies = []; // 主题回复
	private endTime = ''; // 回复截止时间
	private params: any = {};
	private loading = true;
	private loadFailedTime = 0; // 失败次数
	private onLoad(options: any) {
		this.params = options;
		this.loadData();
	}
	private resetLoading(time?: number) {
		this.loading = false;
		time === 0 && (this.loadFailedTime = 0);
		uni.hideLoading();
	}
	// 加载数据
	private async loadData(reget?: boolean) {
		if (this.loadFailedTime <= 0 || reget) {
			uni.showLoading({
				title: '加载中...',
				mask: true,
			});
		}
		this.loading = true;
		const params = this.params;
		const res = await $getTopicDetail(params.id);
		if (res) {
			const { detail, replys } = res;
			this.getTopicsDetail(detail[0], replys);
		} else {
			this.loadFailedTime += 1;
			if (this.loadFailedTime <= 10) {
				this.loadData();
			} else {
				this.resetLoading();
			}
		}
	}
	// 取主题详情
	private getTopicsDetail(detail: any, replys: any) {
		let topicsDetail = null;
		topicsDetail = {
			data: detail.content,
			last_reply:
				dayjs(detail.created * 1000)
					.startOf('hour')
					.fromNow() + ' ',
			tab_name: detail.node.title,
			tag_value: detail.node.name,
			title: detail.title,
			author: detail.member.username,
			avatar: detail.member.avatar_mini,
			id: detail.id,
		};
		this.topicsDetail = topicsDetail;
		this.getTopicsReplies(replys);
		this.saveHistoryTopics({ ...topicsDetail });
	}
	// 取主题回复
	private getTopicsReplies(replys: any) {
		const len = replys.length;
		if (!len) {
			this.loadFailedTime = 0;
			this.loading = false;
			uni.hideLoading();
			return;
		}
		for (let i = 0; i < len; i++) {
			const item = replys[i];
			const { content } = item;
			const newContent = content.replace(
				/(@.*?\s)/g,
				'<text class="user-name">$1</text>'
			);
			item.content = newContent;
		}
		const endTime =
			replys[len - 1].last_modified &&
			dayjs(replys[len - 1].last_modified * 1000).format(
				'YYYY-MM-DD HH:mm:ss'
			);
		this.topicsReplies = replys;
		this.endTime = endTime;
		this.resetLoading(0);
	}
	onShareAppMessage(e: any) {
		const { id } = this.params;
		return {
			title: 'v2ex mini',
			path: `/pages/Detail?id=${id}`,
			success: (res: any) => {},
			fail: (res: any) => {},
		};
	}
}
</script>

<style lang="less" scoped>
.container {
	padding-bottom: 60rpx;
}
text {
	user-select: text;
}
.load-failed {
	padding-top: 150rpx;
}
.bottom-button {
	/deep/.van-button--round {
		padding: 0 50rpx !important;
	}
}
.topic-wrap {
	padding: 25rpx 30rpx;
	background: #fff;
	/deep/.user-name {
		color: #4474ff;
	}
	.user-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40rpx;
		margin-bottom: 20rpx;
		.name {
			font-size: 28rpx;
			color: #666;
			font-weight: 500;
		}
		.time {
			font-size: 22rpx;
			color: #999;
			font-weight: 400;
			margin-left: 20rpx;
		}
	}
	.title {
		font-size: 32rpx;
		color: #333;
		line-height: 45rpx;
		font-weight: 500;
		margin-bottom: 20rpx;
	}
	.tag-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		.tag {
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			color: #333;
			font-size: 24rpx;
			font-weight: 400;
			view {
				background: #f6f6f6;
				padding: 0 20rpx;
				border-radius: 25rpx;
			}
			.tag-symbol {
				color: #4474ff;
				font-size: 24rpx;
				margin-right: 5rpx;
			}
		}
		.reply {
			color: #999;
			font-size: 22rpx;
		}
	}
}
.floor {
	color: #999;
	font-size: 22rpx;
}
.reply-num {
	height: 50rpx;
	line-height: 50rpx;
	padding: 0 30rpx;
	background: #f5f5f5;
	color: #999;
	font-size: 22rpx;
	font-weight: 400;
}
.topic-header {
	border-top: 20rpx solid #f5f5f5;
}
.topic-reply {
	padding-bottom: 0;
	border-bottom: 20rpx solid #f5f5f5;
	/deep/rich-text {
		font-weight: 500;
	}
	.user-info {
		margin-bottom: 0;
	}
}
</style>
