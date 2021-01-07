<template>
	<view class="container">
		<we-tabs
			:tabs="topTags"
			:activeTab="activeTab"
			swiperClass="weui-tabs-swiper"
			@tabclick="onClick"
			activeClass="tab-bar-title__selected"
		>
		</we-tabs>
		<swiper
			class="weui-tabs-swiper"
			:current="activeTab"
			duration="300"
			@change="onChange"
		>
			<swiper-item
				class="weui-tabs-swiper-item"
				v-for="(item, tabIndex) in topTags"
				:key="tabIndex"
				:data-index="tabIndex"
			>
				<view
					class="tab-skeleton"
					v-if="loading || activeTab !== tabIndex"
				>
					<Skeleton type="list"></Skeleton>
				</view>
				<view v-else>
					<view
						v-for="(item, index) in tagList"
						:key="index"
						@click="getTopicsDetail(item.id)"
					>
						<Topic :item="item"></Topic>
					</view>
					<view class="noMore">没有更多了，看看别的节点吧～</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import rules from '@/utils/config';
import Topic from '@/components/Topic.vue';
import Skeleton from '@/components/Skeleton.vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import topTags from '@/config/topTag.config';
import { Getter, Mutation, State } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import { $getAllTopics, $getHotList } from '@/services/Common.http';
import { TagData, TagDataKey, TagTime, TagTimeKey } from '@/types/index.type';

dayjs.extend(relativeTime);

@Component({
	name: 'All',
	components: {
		Topic,
		Skeleton,
	},
})
export default class All extends Vue {
	@State('stroageTime') private stroageTime!: number; // 缓存时长
	@State('visited') private visited!: string[]; // 访问过的
	// 获取tag数据
	@Getter('getTagData') private getTagData!: (key: TagDataKey) => any;
	// 获取tag时间
	@Getter('getTagTime') private getTagTime!: (key: TagTimeKey) => string;
	@Mutation('updateTagTime') private updateTagTime!: (
		tagTime: TagTime
	) => void;
	@Mutation('updateTagData') private updateTagData!: (
		tagData: TagData
	) => void;
	@Mutation('updateVisited') private updateVisited!: (
		visited: string[]
	) => void;
	private topTags = topTags; // tag列表
	private curTag = 'top';
	private tagList: any = []; // 主题内容
	private loading = true;
	private activeTab = 0;

	private onLoad() {
		const title = this.curTag;
		this.getData(title);
	}
	// 获取数据
	private getData(title: string) {
		// 如果没拿到数据就调接口
		if (this.isExpired(title)) {
			// 最热的帖子从接口拿
			if (title === 'top') {
				this.getHotList(title);
			} else {
				this.getAllTopics(title);
			}
		}
	}
	// 点击tab
	private onClick(e: any) {
		this.activeTab = e.detail.index;
	}
	// 切换tab时
	private onChange(e: any) {
		const index = e.detail.current;
		const tags = this.topTags;
		const title = tags[index].value;
		this.loading = true;
		this.activeTab = index;
		this.getData(title);
	}
	// 判定缓存数据是否过期
	private isExpired(title: string) {
		uni.showLoading({
			title: '正在加载中...',
			mask: true,
		});
		const time = this.getTagTime((TagTimeKey as any)[title]);
		if (!time) {
			return true;
		} else {
			const old = dayjs(time);
			const now = dayjs();
			// 缓存时间超过设定的时间,则重新请求数据
			if (now.diff(old, 'minute') >= this.stroageTime) {
				return true;
			}
			this.getStorageData(title);
		}
		return true;
	}
	// 从缓存取数据
	private getStorageData(title: string) {
		const tagList = this.getTagData((TagDataKey as any)[title]);
		if (tagList.length) {
			const visited: any = this.visited;
			tagList.forEach((item: any) => {
				if (visited.includes(item.id)) {
					item.beVisited = true;
				}
			});
			this.tagList = tagList;
			this.loading = false;
			uni.hideLoading();
			return false;
		}
	}
	// 根据tag获取内容
	private async getAllTopics(title: string) {
		const data = await $getAllTopics(title);
		if (data) {
			const visited = this.visited;
			const tagArr = data.map((item: any) => {
				let beVisited = false;
				if (visited.includes(item.id)) {
					beVisited = true;
				}
				return { ...item, beVisited };
			});
			this.commonUpdate(title, tagArr);
		}
	}
	// 获取热门列表
	private async getHotList(title: string) {
		const data = await $getHotList();
		if (data) {
			const visited = this.visited;
			const tagArr = data.map((item: any) => {
				let beVisited = false;
				if (visited.includes(item.id)) {
					beVisited = true;
				}
				return { ...item, beVisited };
			});
			this.commonUpdate(title, tagArr);
		}
	}
	// 更新缓存
	private commonUpdate(title: string, tagArr: any) {
		uni.pageScrollTo({
			scrollTop: 0,
		});
		this.updateTagData({
			key: (TagDataKey as any)[title],
			value: tagArr,
		});
		this.updateTagTime({
			key: (TagTimeKey as any)[title],
			value: dayjs(),
		});
		this.tagList = tagArr;
		this.loading = false;
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
}
</script>

<style lang="less" scoped>
.container {
	/deep/.weui-tabs-bar__wrp {
		border-bottom: 1px solid #eee;
		padding: 5px 0;
		position: fixed;
		top: 0;
		z-index: 999;
	}
	.weui-tabs-swiper {
		width: 100%;
		height: 100vh;
		padding-top: 45px;
		box-sizing: border-box;
	}
	.weui-tabs-swiper-item {
		height: 100vh;
		width: 100%;
		overflow-y: scroll;
	}
	.tab-skeleton {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	/deep/.weui-tabs-bar__title {
		margin: 0px 10px;
	}
	/deep/.tab-bar-title__selected {
		font-size: 20px;
		font-weight: bold;
	}
}
</style>
