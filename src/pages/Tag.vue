<template>
	<view :class="darkModel ? 'dark' : ''">
		<template v-if="loading && loadType === 'refresh'">
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
							@click="getTagTopics()"
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
				<view
					v-for="(item, index) in tagList"
					:key="index"
					@click="getTopicsDetail(item.id)"
				>
					<Topic :item="item"></Topic>
				</view>
				<view v-if="noMore" class="noMore">
					没有更多了，休息一下吧～
				</view>
			</template>
		</template>
	</view>
</template>
<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';
import rules from '@/utils/config';
import Topic from '@/components/Topic.vue';
import Skeleton from '@/components/Skeleton.vue';
import { $getTagTopics } from '@/services/Common.http';
import { Mutation, State } from 'vuex-class';
import { MixinDark } from '@/mixin/Dark.mixin';
@Component({
	name: 'Tag',
	components: {
		Topic,
		Skeleton,
	},
})
export default class Tag extends Mixins(MixinDark) {
	@State('visited') private visited!: string[]; // 访问过的
	@Mutation('updateVisited')
	private updateVisited!: (visited: string[]) => void;
	private tagList: any = []; // 主题内容
	private pageNum = 1; // 页码
	private value = ''; // 参数
	private loading = true;
	private noMore = false; // 没有更多了
	private loadType = 'refresh'; // 加载类型
	private loadFailedTime = 0; // 失败次数

	private onLoad(options: any) {
		uni.setNavigationBarTitle({ title: options.title });
		const value = options.value;
		this.value = value;
		this.getTagTopics();
	}
	// 根据tag获取内容
	private async getTagTopics() {
		this.loading = true;
		const tagList = this.tagList;
		const value = this.value;
		const data = await $getTagTopics({ value, pageNum: this.pageNum });
		if (data) {
			const visited: any = this.visited;
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
			this.loading = false;
			this.loadFailedTime = 0;
		} else {
			this.loading = false;
			this.loadFailedTime += 1;
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
		this.getTagTopics();
	}
	private onReachBottom() {
		this.pageNum = ++this.pageNum;
		this.loadType = 'loadMore';
		this.getTagTopics();
	}
}
</script>
<style lang="less" scoped>
.load-failed {
	padding-top: 150rpx;
}
.dark {
	background: #191919;
	color: #d1d1d1;
	min-height: 100vh;
}
</style>
