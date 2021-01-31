<template>
	<view :class="darkModel ? 'dark' : ''">
		<template v-if="loading">
			<Skeleton type="list"></Skeleton>
		</template>
		<template v-else>
			<view class="load-failed" v-if="loadFailedTime > 0">
				<view class="reload" v-if="loadFailedTime < 2">
					<van-empty image="error" description="加载失败">
						<van-button
							round
							type="info"
							class="bottom-button"
							@click="loadData()"
						>
							再试一次
						</van-button>
					</van-empty>
				</view>
				<view class="quit" v-else>
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
				</view>
			</view>
			<template v-else>
				<view class="header">
					<User :item="topicsDetail"></User>
					<view class="title">{{ topicsDetail.title }}</view>
				</view>
				<view class="content" v-if="topicsDetail.data">
					<mp-html :content="topicsDetail.data" />
				</view>
				<view class="line"></view>
				<view class="totalReplies">
					{{ topicsReplies.length }} 回复 | 截止 {{ endTime }}
				</view>
				<view
					class="pages"
					v-for="(item, index) in topicsReplies"
					:key="index"
				>
					<User :item="item.user"></User>
					<view class="title">
						<mp-html :content="item.content" />
					</view>
				</view>
			</template>
		</template>
	</view>
</template>

<script lang="ts">
import { $getTopicsDetail, $getTopicReplies } from '@/services/Common.http';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear'; // 导入插件
import 'dayjs/locale/zh-cn'; // 导入本地化语言
dayjs.extend(isLeapYear); // 使用插件
dayjs.locale('zh-cn'); // 使用本地化语言

import Vue from 'vue';
import { Component, Mixins } from 'vue-property-decorator';
import User from '@/components/User.vue';
import Skeleton from '@/components/Skeleton.vue';
import mpHtml from '@/components/mp-html/mp-html.vue';
import { MixinDark } from '@/mixin/Dark.mixin';
@Component({
	name: 'Detail',
	components: {
		User,
		Skeleton,
	},
})
export default class Detail extends Mixins(MixinDark) {
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
	// 加载数据
	private async loadData() {
		this.loading = true;
		const params = this.params;
		uni.showLoading({
			title: '加载中...',
			mask: true,
		});
		const detail = $getTopicsDetail(params.id);
		const reply = $getTopicReplies(params.id);
		try {
			const res = await Promise.all([detail, reply]);
			this.getTopicsDetail(res);
		} catch (error) {
			this.loading = false;
			this.loadFailedTime += 1;
		}
	}
	// 取主题详情
	private getTopicsDetail(res: any) {
		let topicsDetail = null;
		const data = res[0];
		topicsDetail = {
			data: data.content,
			lastReply:
				dayjs(data.created * 1000)
					.startOf('hour')
					.fromNow() + ' ',
			lastReplyBy: `由 ${data.last_reply_by} 创建`,
			tagTitle: data.node.title,
			title: data.title,
			author: data.member.username,
			avatarUrl: data.member.avatar_mini,
			id: data.member.id,
			detail: 'node',
		};
		this.topicsDetail = topicsDetail;
		this.getTopicsReplies(res[1]);
	}
	// 取主题回复
	private getTopicsReplies(res: any) {
		const { id } = this.topicsDetail;
		const len = res.length;
		if (!len) {
			this.loading = false;
			uni.hideLoading();
			return;
		}
		for (let i = 0; i < len; i++) {
			const item = res[i];
			const isUp = item.member.id === id;
			item.content = item.content;
			item.user = {
				id: item.member.id,
				index: i + 1,
				isUp,
				author: item.member.username,
				avatarUrl: item.member.avatar_mini,
				lastReply:
					dayjs(item.last_modified * 1000)
						.startOf('hour')
						.fromNow() + ' ',
				detail: 'floor',
			};
		}
		const endTime =
			res[len - 1].last_modified &&
			dayjs(res[len - 1].last_modified * 1000).format(
				'YYYY-MM-DD HH:mm:ss'
			);
		this.topicsReplies = res;
		this.endTime = endTime;
		this.loading = false;
		uni.hideLoading();
	}
}
</script>

<style lang="less" scoped>
.load-failed {
	padding-top: 150rpx;
}
.header {
	padding: 20rpx;
	.title {
		line-height: 40rpx;
		margin-top: 20rpx;
	}
}
.content {
	margin: 0 20rpx;
	padding: 20rpx 0;
	line-height: 40rpx;
	border-top: 1rpx solid #dedede;
}
.line {
	height: 15rpx;
	background: #f8f8f8;
}
.totalReplies {
	padding: 10rpx 20rpx;
	font-size: 24rpx;
	border-bottom: 2rpx solid #f5f5f5;
	color: #888;
}
.pages {
	padding: 20rpx;
	border-bottom: 2rpx solid #f5f5f5;
	.title {
		margin-top: 20rpx;
	}
}
.dark {
	background: #191919;
	color: #d1d1d1;
	min-height: 100vh;
	.content {
		border-top: 2rpx solid #222;
	}
	.totalReplies {
		border-bottom: 2rpx solid #333;
	}
	.pages {
		border-bottom: 2rpx solid #222;
	}
	.line {
		height: 2rpx;
		background: #333;
	}
}
</style>
