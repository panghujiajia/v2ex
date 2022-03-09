<template>
    <view class="topic-wrap" :class="[item.beVisited ? 'cur' : '']">
        <view class="user-info">
            <view class="user">
                <image class="avatar" :src="item.avatar"></image>
                <text class="name">{{ item.author }}</text>
                <text class="time">{{ item.last_reply_time }}</text>
            </view>
        </view>
        <view class="title">{{ item.title }}</view>
        <view class="tag-info">
            <view class="tag">
                <view v-if="item.tag_name" @click.stop="getTags(item)">
                    <text class="tag-symbol">#</text>
                    <text>{{ item.tag_name }}</text>
                </view>
            </view>
            <view class="reply" v-if="item.reply_num">
                {{ item.reply_num }}条回复
            </view>
        </view>
    </view>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    name: 'Topic'
})
export default class Topic extends Vue {
    @Prop()
    private item: any;

    private getTags(item: any) {
        uni.navigateTo({
            url: `/pages/Tag?value=${item.tag_link}&title=${item.tag_name}`
        });
    }
}
</script>
<style lang="less" scoped>
.topic-wrap {
    padding: 25rpx 30rpx;
    background: #fff;
    margin-top: 20rpx;
    .user-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40rpx;
        .user {
            display: flex;
            align-items: center;
            .avatar {
                width: 40rpx;
                height: 40rpx;
                margin-right: 14rpx;
                border-radius: 8rpx;
            }
        }
        .name {
            font-size: 28rpx;
            color: #666;
            font-weight: 500;
        }
        .time {
            font-size: 22rpx;
            color: #999;
            font-weight: 400;
            margin-left: 20rpx;
        }
    }
    .title {
        font-size: 32rpx;
        color: #333;
        line-height: 45rpx;
        font-weight: 500;
    }
    .tag-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10rpx;
        .tag {
            height: 50rpx;
            line-height: 50rpx;
            text-align: center;
            color: #333;
            font-size: 24rpx;
            font-weight: 400;
            view {
                background: #f6f6f6;
                padding: 0 20rpx;
                border-radius: 25rpx;
            }
            .tag-symbol {
                color: #4474ff;
                font-size: 24rpx;
                margin-right: 5rpx;
            }
        }
        .reply {
            color: #999;
            font-size: 22rpx;
        }
    }
}
.cur {
    opacity: 0.6;
}
</style>
