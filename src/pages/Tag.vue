<template>
	<view class="container">
		<template v-if="loading && loadType === 'refresh'">
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
							@click="getAllTopics(true)"
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
				<view class="topic-header">
					<view class="header-top">
						<text class="name">{{ title }}</text>
						主题总数 {{ nodeInfo.topic_count || 0 }}
					</view>
					<view class="header-bottom">
						{{
							nodeInfo.topic_intro ||
							'World is powered by solitude'
						}}
					</view>
				</view>
				<view class="list-wrap">
					<view
						class="item"
						v-for="(item, index) in tagList"
						:key="index"
						@click.stop="getTopicsDetail(item.id)"
					>
						<Topic :item="item"></Topic>
					</view>
				</view>
				<view v-if="noMore" class="noMore">
					没有更多了，休息一下吧～
				</view>
			</template>
		</template>
	</view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Topic from '@/components/Topic.vue';
import Skeleton from '@/components/Skeleton.vue';
import { $getAllTopics } from '@/services/Common.http';
import { Mutation, State } from 'vuex-class';
@Component({
	name: 'Tag',
	components: {
		Topic,
		Skeleton,
	},
})
export default class Tag extends Vue {
	@State('visited')
	private visited!: string[]; // 访问过的
	@Mutation('updateVisited')
	private updateVisited!: (visited: string[]) => void;
	private tagList: any = []; // 主题内容
	private nodeInfo: any = {
		topic_count: 0,
		topic_intro: '',
	};
	private pageNum = 1; // 页码
	private value = ''; // 参数
	private title = '';
	private loading = true;
	private noMore = false; // 没有更多了
	private loadType = 'refresh'; // 加载类型
	private loadFailedTime = 0; // 失败次数

	private onLoad(options: any) {
		const { value, title } = options;
		uni.setNavigationBarTitle({ title });
		this.value = value;
		this.title = title;
		this.getAllTopics();
	}
	private resetLoading(time?: number) {
		this.loading = false;
		time === 0 && (this.loadFailedTime = 0);
		uni.hideLoading();
	}
	// 根据tag获取内容
	private async getAllTopics(reget?: boolean) {
		if (this.loadFailedTime <= 0 || reget) {
			uni.showLoading({
				title: '加载中...',
				mask: true,
			});
		}
		this.loading = true;
		const tagList = this.tagList;
		const tab = this.value;
		const res = await $getAllTopics({ tab, p: this.pageNum });
		if (res) {
			const visited: any = this.visited;
			const { data, nodeInfo } = res;
			this.nodeInfo = nodeInfo;
			const tagArr = data.map((item: any) => {
				let beVisited = false;
				if (visited.includes(item.id)) {
					beVisited = true;
				}
				return { ...item, beVisited };
			});
			// 如果是加载更多
			if (this.loadType === 'loadMore') {
				this.isLastPage(tagArr);
				if (!this.noMore) {
					this.tagList = [...tagList, ...tagArr];
				}
			} else {
				this.tagList = tagArr;
				uni.stopPullDownRefresh();
			}
			this.resetLoading(0);
		} else {
			this.loadFailedTime += 1;
			if (this.loadFailedTime <= 10) {
				this.getAllTopics();
			} else {
				this.resetLoading();
			}
		}
	}
	// 判断是否最后一页
	private isLastPage(data: any) {
		const dataLen = data.length;
		const tagList = this.tagList;
		const tagListLen = tagList.length;
		if (tagListLen > dataLen) {
			if (data[dataLen - 1].id === tagList[tagListLen - 1].id) {
				this.noMore = true;
			}
		}
	}
	// 跳转主题详情
	private getTopicsDetail(id: string) {
		const visited = this.visited;
		const list = this.tagList;
		if (!visited.includes(id)) {
			visited.push(id);
			const target = list.find((item: any) => {
				return item.id === id;
			});
			target.beVisited = true;
			this.tagList = list;
		}
		this.updateVisited(visited);
		uni.navigateTo({
			url: `/pages/Detail?id=${id}`,
		});
	}

	private onPullDownRefresh() {
		this.pageNum = 1;
		this.loadType = 'refresh';
		this.noMore = false;
		this.getAllTopics();
	}
	private onReachBottom() {
		this.pageNum = ++this.pageNum;
		this.loadType = 'loadMore';
		this.getAllTopics();
	}
	onShareAppMessage(e: any) {
		return {
			title: 'Fake v2ex',
			path: `/pages/Tag?value=${this.value}&title=${this.title}`,
			success: (res: any) => {},
			fail: (res: any) => {},
		};
	}
}
</script>
<style lang="less" scoped>
.bottom-button {
	/deep/.van-button--round {
		padding: 0 50rpx !important;
	}
}
.topic-header {
	min-height: 200rpx;
	background: url(https://ibao-private.oss-cn-shanghai.aliyuncs.com/yunibaoadmin/bg-topic.jpg)
		50% no-repeat;
	background-size: cover;
	padding: 30rpx;
	box-sizing: border-box;
	color: #fff;
	display: flex;
	flex-direction: column;
	font-weight: 400;
	.header-top {
		font-size: 26rpx;
		.name {
			font-size: 38rpx;
			margin-right: 20rpx;
			font-weight: 500;
		}
	}
	.header-bottom {
		font-size: 28rpx;
		margin-top: 15rpx;
	}
}
.list-wrap {
	background: #f5f5f5;
	border-top: 20rpx solid #f5f5f5;
	.item {
		&:last-child {
			/deep/.topic-wrap {
				margin-bottom: 0;
			}
		}
	}
}
.load-failed {
	padding-top: 150rpx;
}
</style>
