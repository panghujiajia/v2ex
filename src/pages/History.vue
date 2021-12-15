<template>
    <view class="container">
        <view class="load-failed" v-if="!historyTopic.length">
            <view class="reload">
                <image
                    class="empty-img"
                    src="https://img01.yzcdn.cn/vant/empty-image-default.png"
                >
                </image>
                <view class="empty-desc">暂无访问记录</view>
            </view>
        </view>
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
        Topic
    }
})
export default class History extends Vue {
    @State('historyTopic')
    private historyTopic!: any[];
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
