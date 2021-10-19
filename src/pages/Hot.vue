<template>
	<view class="container">
		<we-tabs
			:tabs="topTags"
			:activeTab="activeTab"
			@tabclick="onClick"
			activeClass="tab-bar-title__selected"
			tabUnderlineColor="#4474FF"
			tabActiveTextColor="#4474FF"
			tabInactiveTextColor="#666666"
			tabBackgroundColor="#fff"
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
					<view class="load-failed" v-if="loadFailedTime > 0">
						<view class="reload">
							<van-empty image="error" description="加载失败">
								<van-button
									round
									type="info"
									class="bottom-button"
									@click="getData(true)"
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
								<navigator
									target="miniProgram"
									open-type="exit"
								>
									<van-button
										round
										type="info"
										class="bottom-button"
									>
										等会再来
									</van-button>
								</navigator>
							</van-empty>
						</view> -->
					</view>
					<template v-else>
						<view class="list-wrap">
							<view
								class="item"
								v-for="(item, index) in tagList"
								:key="index"
								@click.stop="getTopicsDetail(item.id)"
							>
								<Topic :item="item"></Topic>
							</view>
							<view class="item">
								<ad unit-id="adunit-1f991a273d575025"></ad>
							</view>
						</view>
						<view class="noMore">没有更多了，看看别的节点吧～</view>
					</template>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import Topic from '@/components/Topic.vue';
import Skeleton from '@/components/Skeleton.vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import topTags from '@/config/topTag.config';
import { Getter, Mutation, State } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import { $getTabTopics } from '@/services/Common.http';
import { TagData, TagDataKey, TagTime, TagTimeKey } from '@/types/index.type';

dayjs.extend(relativeTime);

@Component({
	name: 'Hot',
	components: {
		Topic,
		Skeleton,
	},
})
export default class Hot extends Vue {
	@State('adSwitch')
	private adSwitch!: boolean;
	@State('stroageTime')
	private stroageTime!: number; // 缓存时长
	@State('visited')
	private visited!: string[]; // 访问过的
	// 获取tag数据
	@Getter('getTagData')
	private getTagData!: (key: TagDataKey) => any;
	// 获取tag时间
	@Getter('getTagTime')
	private getTagTime!: (key: TagTimeKey) => string;
	@Mutation('updateAdSwitch')
	private updateAdSwitch!: () => void;
	@Mutation('updateTagTime')
	private updateTagTime!: (tagTime: TagTime) => void;
	@Mutation('updateTagData')
	private updateTagData!: (tagData: TagData) => void;
	@Mutation('updateVisited')
	private updateVisited!: (visited: string[]) => void;
	private topTags = topTags; // tag列表
	private curTag = 'top';
	private tagList: any = []; // 主题内容
	private loading = true;
	private activeTab = 0;
	private loadFailedTime = 0; // 失败次数

	private onShow() {
		this.updateAdSwitch();
	}
	private onLoad() {
		this.getData();
	}
	// 获取数据
	private getData(reget?: boolean) {
		if (this.loadFailedTime <= 0 || reget) {
			uni.showLoading({
				title: '加载中...',
				mask: true,
			});
		}
		this.loading = true;
		const title = this.curTag;
		// 如果没拿到数据就调接口
		if (this.isExpired(title)) {
			this.getTabTopics(title);
		}
	}
	private resetLoading(time?: number) {
		this.loading = false;
		time === 0 && (this.loadFailedTime = 0);
		uni.hideLoading();
	}
	// 点击tab
	private onClick(e: any) {
		this.activeTab = e.detail.index;
	}
	// 切换tab时
	private onChange(e: any) {
		const index = e.detail.current;
		const tags = this.topTags;
		this.curTag = tags[index].value;
		this.activeTab = index;
		this.getData();
	}
	// 判定缓存数据是否过期
	private isExpired(title: string) {
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
		return false;
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
			this.resetLoading(0);
			return false;
		}
	}
	// 根据tag获取内容
	private async getTabTopics(title: string) {
		const data = await $getTabTopics(title);
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
		} else {
			this.loadFailedTime += 1;
			if (this.loadFailedTime <= 10) {
				this.getData();
			} else {
				this.resetLoading();
			}
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
		this.resetLoading(0);
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
	onShareAppMessage(e: any) {
		return {
			title: 'v2ex mini',
			path: '/pages/Hot',
			success: (res: any) => {},
			fail: (res: any) => {},
		};
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
		background: #fff;
		width: 100%;
		height: 100vh;
		padding-top: 41px;
		box-sizing: border-box;
	}
	.weui-tabs-swiper-item {
		height: 100vh;
		width: 100%;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
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
	.load-failed {
		padding-top: 150rpx;
	}
	.bottom-button {
		/deep/.van-button--round {
			padding: 0 50rpx !important;
		}
	}
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
}
</style>
