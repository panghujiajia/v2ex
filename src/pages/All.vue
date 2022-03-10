<template>
    <view class="container">
        <view class="my-tags">
            <view>
                <view class="title">我喜欢的</view>
                <template>
                    <view
                        v-for="item in myTags"
                        :key="item.value"
                        :class="{
                            shake: isEdit
                        }"
                        class="my-tag"
                        @click="handleClick(item)"
                    >
                        {{ item.title }}
                    </view>
                </template>
                <view class="tag edit" @click="toggleEdit()">
                    {{ isEdit ? '完成' : '编辑' }}
                </view>
            </view>
        </view>
        <view class="tag-wrap">
            <view v-if="cookie">
                <view class="title">测试节点</view>
                <view
                    class="tag"
                    @click="handleClick({ value: 'sandbox', title: '沙盒' })"
                >
                    沙盒
                </view>
            </view>
            <view v-for="key in Object.keys(allTag)" :key="key">
                <view class="title">{{ key }}</view>
                <view
                    v-for="item in allTag[key]"
                    :key="item.value"
                    :class="{
                        shake: isEdit,
                        cur: isEdit && item.active
                    }"
                    class="tag"
                    @click="handleClick(item)"
                >
                    {{ item.title }}
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';

@Component({
    name: 'All'
})
export default class All extends Vue {
    @State('myTags')
    private myTags!: string[];
    @State('allTag')
    private allTag!: any;
    @State('cookie')
    private cookie!: string;
    @Mutation('updateMyTags')
    private updateMyTags!: (data: any) => void;
    @Mutation('saveAllTag')
    private saveAllTag!: (data: any) => void;
    @Action('getAllTagConfig')
    private getAllTagConfig!: () => void;
    private isEdit = false; // 编辑状态
    private onLoad() {
        this.getAllTagConfig();
        this.getActive();
    }
    // 设置编辑状态下高量选中的
    private getActive() {
        const allTag: any = this.allTag;
        const myTags: any = this.myTags;
        const keys = Object.keys(allTag);
        const newTags: any = {};
        for (const key of keys) {
            let tags = allTag[key];
            tags = tags.map((item: any) => {
                item.active = false;
                for (const myTag of myTags) {
                    if (item.title === myTag.title) {
                        item.active = true;
                    }
                }
                return item;
            });
            newTags[key] = tags;
        }
        this.saveAllTag(newTags);
    }
    // 添加我喜欢
    private setMyTags(tag: any) {
        const myTags: any = this.myTags;
        const index = myTags.findIndex((item: any) => {
            return item.title === tag.title;
        });
        if (index > -1) {
            tag.active = false;
            myTags.splice(index, 1);
        } else {
            tag.active = true;
            myTags.push(tag);
        }
        this.updateMyTags(myTags);
    }
    // 编辑节点
    private toggleEdit() {
        uni.vibrateShort({});
        const isEdit = this.isEdit;
        this.isEdit = !isEdit;
    }
    // 点击节点
    private handleClick(tag: any) {
        // 编辑模式
        if (this.isEdit) {
            uni.vibrateShort({});
            this.setMyTags(tag);
        } else {
            this.getTags(tag);
        }
    }
    // 跳转tag
    private getTags(tag: any) {
        uni.navigateTo({
            url: `/pages/Tag?value=${tag.value}&title=${tag.title}`
        });
    }
    private onHide() {
        this.isEdit = false;
    }
    // #ifdef MP-WEIXIN
    private onShareAppMessage(e: any) {
        return {
            title: 'v2ex',
            path: '/pages/Hot'
        };
    }
    // #endif
}
</script>

<style lang="less" scoped>
.my-tags,
.tag-wrap {
    padding: 20rpx;
    .title {
        line-height: 80rpx;
        margin-bottom: 20rpx;
        font-size: 30rpx;
        font-weight: bold;
    }
    .tag,
    .my-tag {
        line-height: 60rpx;
        padding: 0 20rpx;
        background: #f2f2f2;
        border-radius: 10rpx;
        font-size: 24rpx;
        height: 60rpx;
        display: inline-block;
        vertical-align: top;
        margin: 0 20rpx 20rpx 0;
        &.cur {
            background: darkgray;
            color: #fff;
        }
        &.shake {
            &:nth-child(n) {
                animation: shake infinite alternate 0.1s;
            }
            &:nth-child(2n) {
                animation-delay: 0.1s;
            }
            &:nth-child(3n) {
                animation-delay: 0.2s;
            }
            &:nth-child(4n) {
                animation-delay: 0.1s;
            }
            &:nth-child(4n) {
                animation-delay: 0;
            }
        }
        &.touch {
            box-shadow: 0 0 13rpx #ccc;
        }
    }
    .edit {
        background: #fff;
        border: 2rpx solid #dedede;
        box-sizing: border-box;
        color: #666;
    }
}
@keyframes shake {
    from {
        transform: rotate(2deg);
    }
    to {
        transform: rotate(-2deg);
    }
}
</style>
