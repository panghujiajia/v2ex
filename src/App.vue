<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    mpType: 'app',
    onLaunch() {
        console.log('App Launch');
        // wx.cloud.init({
        //     env: 'common-9c2ec5' //点击开发者工具上的 云开发->设置 就看到了
        // });
    },
    onShow() {
        console.log('App Show');
    },
    onHide() {
        console.log('App Hide');
    }
});
</script>

<style lang="less">
/*每个页面公共css */
* {
    font-family: PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB,
        Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
}
.cell-group {
    // padding-left: 30rpx;
    background: #fff;
    .icon-arrow {
        position: relative;
        width: 20px;
        height: 20px;
        &:after,
        &:before {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            width: 2px;
            height: 12px;
            border-radius: 2px;
            background: #ccc;
            transform: rotateZ(-45deg);
        }
        &:after {
            top: 8px;
            transform: rotateZ(45deg);
        }
    }
    .cell {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100rpx;
        padding: 0 30rpx 0 40rpx;
        box-sizing: border-box;
        border-bottom: 1rpx solid #f0f0f0;
        color: #282828;
        font-size: 32rpx;
        view {
            // display: flex;
            // align-items: center;
        }
        text {
            font-size: 24rpx;
            color: #999;
            line-height: 100rpx;
        }
        &:last-child {
            border-bottom: 0 none;
        }
    }
}
.noMore {
    padding: 30rpx 0;
    text-align: center;
    color: #999;
    font-size: 24rpx;
}
.btn-default {
    margin: 20px auto;
    width: 160px;
    height: 40px;
    line-height: 40px;
    border-radius: 40px;
    color: #fff;
    text-align: center;
    background: #4474ff;
    font-size: 14px;
}
.load-failed {
    padding-top: 150rpx;
    .reload {
        text-align: center;
        .empty-img {
            width: 160px;
            height: 160px;
        }
        .empty-desc {
            margin-top: 16px;
            padding: 0 60px;
            color: #969799;
            font-size: 14px;
            line-height: 20px;
        }
        .empty-button {
            .btn-default;
        }
    }
}
</style>
