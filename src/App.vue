<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	mpType: 'app',
	onLaunch() {
		console.log('App Launch');
	},
	onShow() {
		console.log('App Show');
	},
	onHide() {
		console.log('App Hide');
	},
});
</script>

<style>
/*每个页面公共css */
* {
	font-family: PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB,
		Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
}
.noMore {
	padding: 30rpx 0;
	text-align: center;
	color: #999;
	font-size: 24rpx;
}
</style>
