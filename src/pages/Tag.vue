<template>
	<view>
		<template v-if="loading">
			<Skeleton type="list"></Skeleton>
		</template>
		<template v-else>
			<view
				v-for="(item, index) in tagList"
				:key="index"
				@click="getTopicsDetail(item.id)"
			>
				<Topic :item="item"></Topic>
			</view>
			<view v-if="noMore" class="noMore">没有更多了，休息一下吧～</view>
		</template>
	</view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import rules from '@/utils/config';
import Topic from '@/components/Topic.vue';
import Skeleton from '@/components/Skeleton.vue';
import { $getTagTopics } from '@/services/Common.http';
import { Mutation, State } from 'vuex-class';
@Component({
	name: 'Tag',
	components: {
		Topic,
		Skeleton,
	},
})
export default class Tag extends Vue {
	@State('visited') private visited!: string[]; // 访问过的
	@Mutation('updateVisited') private updateVisited!: (
		visited: string[]
	) => void;
	private tagList: any = []; // 主题内容
	private pageNum = 1; // 页码
	private value = ''; // 参数
	private loading = true;
	private noMore = false; // 没有更多了
	private loadType = 'refresh'; // 加载类型

	private onLoad(options: any) {
		uni.setNavigationBarTitle({ title: options.title });
		const value = options.value;
		this.value = value;
		this.getTagTopics(value);
	}
	// 根据tag获取内容
	private async getTagTopics(value: string) {
		const tagList = this.tagList;
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
		let visited = this.visited;
		const list = this.tagList;
		if (visited.length) {
			if (!visited.includes(id)) {
				visited.push(id);
				const target = list.find((item: any) => {
					return item.id === id;
				});
				target.beVisited = true;
				this.tagList = list;
			}
		} else {
			visited = [id];
		}
		this.updateVisited(visited);
		uni.navigateTo({
			url: `/pages/Detail?id=${id}`,
		});
	}

	private onPullDownRefresh() {
		console.log('refresh');
		this.pageNum = 1;
		this.loadType = 'refresh';
		this.noMore = false;
		const value = this.value;
		this.getTagTopics(value);
	}
	private onReachBottom() {
		this.pageNum = ++this.pageNum;
		this.loadType = 'loadMore';
		const value = this.value;
		this.getTagTopics(value);
	}
}
</script>
<style lang="less" scoped></style>
