<script lang="ts">
import Vue from 'vue';
import store from './vuex/index';
export default Vue.extend({
	mpType: 'app',
	onLaunch() {
		console.log('App Launch');
		wx.cloud.init({
			env: 'common-9c2ec5', //点击开发者工具上的 云开发->设置 就看到了
		});
	},
	onShow() {
		console.log('App Show');
		// 夜间模式设置tabbar
		const darkModel = store.state.darkModel;
		if (darkModel) {
			uni.setTabBarStyle({
				color: '#d2d2d2',
				backgroundColor: '#191919',
				borderStyle: 'white',
			});
			uni.setTabBarItem({
				index: 0,
				iconPath: 'static/icons/top-dark.png',
			});
			uni.setTabBarItem({
				index: 1,
				iconPath: 'static/icons/all-dark.png',
			});
			uni.setTabBarItem({
				index: 2,
				iconPath: 'static/icons/user-dark.png',
			});
		}
	},
	onHide() {
		console.log('App Hide');
	},
});
</script>

<style lang="less">
/*每个页面公共css */
* {
	font-family: PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB,
		Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
}
.cell-group {
	padding-left: 30rpx;
	background: #fff;
	.cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		padding-right: 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #e5e5e5;
		color: #1a1a1a;
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
</style>
