<template>
	<view class="container">
		<van-empty
			v-if="!historyTopic.length"
			image="error"
			description="暂无访问记录"
		>
		</van-empty>
		<view v-else>
			<view class="list-wrap">
				<view
					class="item"
					v-for="(item, index) in historyTopic"
					:key="index"
					@click.stop="getTopicsDetail(item.id)"
				>
					<Topic :item="item"></Topic>
				</view>
			</view>
			<view class="noMore">只展示最近访问的30条～</view>
		</view>
	</view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Topic from '@/components/Topic.vue';
@Component({
	name: 'History',
	components: {
		Topic,
	},
})
export default class History extends Vue {
	@State('historyTopic')
	private historyTopic!: any[];
	// 跳转主题详情
	private getTopicsDetail(id: string) {
		uni.navigateTo({
			url: `/pages/Detail?id=${id}`,
		});
	}
}
</script>
<style lang="less" scoped>
.list-wrap {
	background: #f5f5f5;
	border-bottom: 1rpx solid #f5f5f5;
	margin-bottom: 20rpx;
	border-top: 20rpx solid #f5f5f5;
	.item {
		&:last-child {
			/deep/.topic-wrap {
				margin-bottom: 0;
			}
		}
	}
}
</style>
