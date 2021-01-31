import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
@Component({})
export class MixinDark extends Vue {
	@State('darkModel') darkModel!: boolean;
	onShow() {
		// 黑夜模式
		if (this.darkModel) {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#191919',
			});
			uni.setBackgroundColor({
				backgroundColor: '#191919',
				backgroundColorTop: '#191919',
				backgroundColorBottom: '#191919',
			});
		} else {
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#ffffff',
			});
			uni.setBackgroundColor({
				backgroundColor: '#ffffff',
				backgroundColorTop: '#ffffff',
				backgroundColorBottom: '#ffffff',
			});
		}
	}
}
