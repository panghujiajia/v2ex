<template>
	<view class="container">
		<view class="cell-group">
			<view class="cell">
				<view>缓存时长</view>
				<van-icon name="arrow" color="#b3b3b3"></van-icon>
			</view>
			<!-- <view class="cell">
				<view></view>
				<van-switch
					size="40rpx"
					:checked="darkModel"
					@change="onSwitchChange"
				/>
			</view> -->
		</view>
	</view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
@Component({
	name: 'Storage',
})
export default class Storage extends Vue {
	@State('stroageTime') private stroageTime!: number;
	@Mutation('updateStroageTime') private updateStroageTime!: (
		data: number
	) => void;
}
</script>
<style lang="less" scoped>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	box-sizing: border-box;
}
</style>
