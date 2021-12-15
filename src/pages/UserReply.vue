<template>
    <view class="container">
        <template v-if="loading">
            <Skeleton type="list"></Skeleton>
        </template>
        <template v-else>
            <view class="load-failed" v-if="!list.length">
                <view class="reload" v-if="loadFaild">
                    <image
                        class="empty-img"
                        src="https://img01.yzcdn.cn/vant/empty-image-error.png"
                    >
                    </image>
                    <view class="empty-desc">加载失败</view>
                    <view class="empty-button" @click="getUserTopics()">
                        再试一次
                    </view>
                </view>
                <view class="reload" v-else>
                    <image
                        class="empty-img"
                        src="https://img01.yzcdn.cn/vant/empty-image-default.png"
                    >
                    </image>
                    <view class="empty-desc">暂无主题记录</view>
                </view>
            </view>
            <view v-else>
                <view class="list-wrap">
                    <view
                        class="item"
                        v-for="(item, index) in list"
                        :key="index"
                        @click.stop="getTopicsDetail(item.id)"
                    >
                        <Topic :item="item"></Topic>
                    </view>
                </view>
                <view class="noMore">没有啦～</view>
            </view>
        </template>
    </view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Topic from '@/components/Topic.vue';
import { $getUserTopics } from '@/services/Common.http';
@Component({
    name: 'UserReply',
    components: {
        Topic
    }
})
export default class UserReply extends Vue {
    private loading = true;
    private loadFaild = false;
    private list: any = [];
    private username = '';
    private onLoad(option: any) {
        this.username = option.username;
        this.getUserTopics();
    }
    private async getUserTopics() {
        const data = await $getUserTopics(this.username);
        if (data) {
            this.list = data;
            this.loadFaild = false;
        } else {
            this.loadFaild = true;
        }
    }
    // 跳转主题详情
    private getTopicsDetail(id: string) {
        uni.navigateTo({
            url: `/pages/Detail?id=${id}`
        });
    }
}
</script>
<style lang="less" scoped>
.list-wrap {
    background: #f5f5f5;
    border-bottom: 1rpx solid #f5f5f5;
    margin-bottom: 20rpx;
    .item {
        &:last-child {
            /deep/.topic-wrap {
                margin-bottom: 0;
            }
        }
    }
}
</style>
