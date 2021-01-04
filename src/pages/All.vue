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
				<view class="tab-skeleton">
					<Skeleton type="list"></Skeleton>
				</view>
				<view
					v-if="!loading && activeTab == tabIndex"
					class="tab-content"
				>
					<view
						v-for="(item, index) in tagList"
						:key="index"
						@click="getTopicsDetail(item.id)"
					>
						<Topic :item="item"></Topic>
					</view>
					<view class="noMore">没有更多了!</view>
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
	private topTags = topTags;
	private curTag = 'top';
	private tagList: any = []; // 主题内容
	private loading = true;
	private activeTab = 0;

	private onLoad() {
		const title = this.curTag;
		// 如果没拿到数据就调接口
		if (!this.getStorageData(title)) {
			// 最热的帖子从接口拿
			if (title === 'top') {
				this.getHotList(title);
			} else {
				this.getTagTopics(title);
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
		// 如果没拿到数据就调接口
		if (!this.getStorageData(title)) {
			// 最热的帖子从接口拿
			if (title === 'top') {
				this.getHotList(title);
			} else {
				this.getTagTopics(title);
			}
		}
	}
	// 从缓存取数据
	private getStorageData(title: string) {
		uni.showLoading({
			title: '正在加载中...',
			mask: true,
		});
		const time = this.getTagTime((TagTimeKey as any)[title]);
		if (!time) {
			return false;
		} else {
			const old = dayjs(time);
			const now = dayjs();
			// 缓存时间超过设定的时间,则重新请求数据
			if (now.diff(old, 'minute') >= this.stroageTime) {
				return false;
			}
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
				return true;
			}
		}
		return false;
	}
	// 根据tag获取内容
	private async getTagTopics(title: string) {
		const data = await $getAllTopics(title);
		// 去掉换行符
		const str = data.trim().replace(/\n|\&nbsp;|•/g, '');

		// 拿到主题列表
		const arr = str.match(rules.reg_item);
		const len = arr.length;
		// 数据
		const tagList = [];
		const visited: any = this.visited;
		for (let i = 0; i < len; i++) {
			const item = arr[i];
			const titleArr = item.split(rules.reg_title);
			const avatarArr = item.split(rules.reg_avatar);
			const tagArr = item.split(rules.reg_tag);
			let lastReply = '';
			// 有人回复
			if (titleArr[2] > 0) {
				lastReply =
					titleArr[4] && titleArr[4].split(rules.reg_repay_1)[1];
			} else {
				lastReply =
					titleArr[4] && titleArr[4].split(rules.reg_repay_0)[1];
			}
			let beVisited = false;
			if (visited.includes(titleArr[1])) {
				beVisited = true;
			}
			const tagObj = {
				id: titleArr[1], // id
				replyNo: titleArr[2], // 回复数
				title: titleArr[3], // 标题
				lastReply, // 最后回复时间
				author: avatarArr[1], // 作者名
				avatarUrl: avatarArr[2], // 头像地址
				tagValue: tagArr[1], // node地址
				tagTitle: tagArr[2], // node名
				beVisited,
			};
			if (tagObj.id && tagObj.title) {
				tagList.push(tagObj);
			}
		}
		uni.pageScrollTo({
			scrollTop: 0,
		});
		this.updateTagData({
			key: (TagDataKey as any)[title],
			value: tagList,
		});
		this.updateTagTime({
			key: (TagTimeKey as any)[title],
			value: dayjs(),
		});
		this.tagList = tagList;
		this.loading = false;
	}
	// 获取热门列表
	private async getHotList(title: string) {
		const data = await $getHotList();
		if (!data) {
			return;
		}
		const len = data.length;
		// 数据
		const tagArr = [];
		const visited = this.visited;
		for (let i = 0; i < len; i++) {
			const item = data[i];
			const lastReply =
				dayjs(item.last_modified * 1000)
					.startOf('hour')
					.fromNow() + ' ';
			let beVisited = false;
			if (visited.includes(item.id)) {
				beVisited = true;
			}
			const tagObj = {
				id: item.id, // id
				replyNo: item.replies, // 回复数
				title: item.title, // 标题
				lastReply, // 最后回复时间
				author: item.member.username, // 作者名
				avatarUrl: item.member.avatar_mini, // 头像地址
				tagValue: item.node.name, // node地址
				tagTitle: item.node.title, // node名
				beVisited,
			};
			tagArr.push(tagObj);
		}
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
		overflow-y: hidden;
		z-index: 98;
	}
	.tab-content {
		position: absolute;
		width: 100%;
		z-index: 99;
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
