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
			<view class="noMore">没有更多了!</view>
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
	private loading = true;

	private onLoad(options: any) {
		uni.setNavigationBarTitle({ title: options.title });
		this.getTagTopics(options.value);
	}
	// 根据tag获取内容
	private async getTagTopics(value: string) {
		const data = await $getTagTopics({ value, pageNum: this.pageNum });
		// 去掉换行符
		const str = data.trim().replace(/\n|\&nbsp;|•/g, '');
		// 拿到主题列表
		const arr = str.match(rules.reg_item);
		const len = arr.length;
		// 数据
		const tagList: any = [];
		const visited: any = this.visited;
		for (let i = 0; i < len; i++) {
			const item = arr[i];
			const titleArr = item.split(rules.reg_title);
			const avatarArr = item.split(rules.reg_avatar);
			const tagArr = item.split(rules.reg_tag);
			let lastReply = '';
			lastReply = item.split(rules.reg_repay_0)[2];
			lastReply = lastReply.split(/\s\s(.*?)\s\s(.*?)/)[3];
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
				tagValue: tagArr.length && tagArr[1], // node地址
				tagTitle: tagArr.length && tagArr[2], // node名
				beVisited,
			};
			if (tagObj.id && tagObj.title) {
				tagList.push(tagObj);
			}
		}
		this.tagList = tagList;
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
<style lang="less" scoped></style>
