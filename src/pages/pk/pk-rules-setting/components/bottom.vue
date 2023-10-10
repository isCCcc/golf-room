<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view>
    <view class="wrapper mb-32">
      <BottomDaShou v-if="isDaShou" />
      <BottomNongMin v-if="options.nongMin" />
      <BottomBiwhat v-if="options.biWhat" />
      <BottomJiang v-if="isJiang" />
      <BottomAward v-if="isAward" />
      <BottomDrawDefine v-if="isDrawDefine" />
      <BottomDingDong v-if="isDingDong('dingDong')" />
      <BottomStartDing v-if="isStartDing" />
      <BottomMinDing v-if="isMinDing" />
      <BottomShouDingDong v-if="isDingDong('shouDingDong')" />
      <BottomDingdongLiu v-if="options.dingDongLiu" />
      <BottomBaoDong v-if="options.baoDong" />
      <BottomBangStyle v-if="isBangStyle" />
      <BottomMinFlag v-if="isMinFlag" />
      <BottomChoushui v-if="options.chouShui" />
      <BottomShourang />
    </view>
    <ShourangButton v-if="isShowRang" />
  </view>

</template>
<script>
// 组件
import BottomAward from '@/pages/pk/pk-rules-setting/components/bottom-award';
import BottomDingDong from './bottom-dindong';
import BottomShouDingDong from './bottom-shou-dindong';
import BottomDaShou from './bottom-dashou';
import BottomNongMin from './bottom-nongmin';
import BottomBaoDong from './bottom-baodong.vue';
import BottomChoushui from './bottom-choushui';
import BottomDingdongLiu from './bottom-dingdong-liu';
import BottomBiwhat from './bottom-biwhat';
import ShourangButton from './shourang-button';
import BottomShourang from './bottom-shourang';
import BottomJiang from './bottom-jiang';
import BottomDrawDefine from './bottom-draw-define';
import BottomStartDing from './bottom-start-ding';
import BottomMinFlag from './bottom-min-flag';
import BottomMinDing from './bottom-min-ding';
import BottomBangStyle from './bottom-bang-style';
// mixins
import PkMixins from '../mixins/index';

export default {
  components: {
    BottomAward,
    BottomDingDong,
    BottomShouDingDong,
    BottomDaShou,
    BottomNongMin,
    BottomBaoDong,
    BottomChoushui,
    BottomDingdongLiu,
    BottomBiwhat,
    ShourangButton,
    BottomShourang,
    BottomJiang,
    BottomDrawDefine,
    BottomStartDing,
    BottomMinFlag,
    BottomMinDing,
    BottomBangStyle,
  },
  mixins: [PkMixins],
  props: {
    options: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  computed: {
    isDingDong() {
      return function (key) {
        // 打老虎
        if (this.options[key] && this.pkConfig.type == 7) {
          return this.pkConfig.sub_type == 0 || this.pkConfig.tiger_style == 1;
        }
        return this.options[key];
      };
    },
    isShowRang(){
      // 打老虎
      if (this.options.shouRang && this.pkConfig.type == 7) {
        return this.pkConfig.sub_type == 0 || this.pkConfig.tiger_style == 1;
      }
      if (this.options.shouRang && this.pkConfig.type == 5) { //四人拉斯-计分1/2/3
        return this.pkConfig.jifen_type == 0
      }
      return this.options.shouRang;
    },
    isJiang() {
    	return this.options.jiang && this.pkConfig.type == 5 && this.pkConfig.jifen_type == 0
    },
    isAward() {
    	if (([4,5].indexOf(this.pkConfig.type) > -1) && this.pkConfig.jifen_type == 1) {	//8421
    		return false;
    	}
    	return this.options.award
    },
    isDrawDefine() {
    	if (this.pkConfig.type == 5 && this.pkConfig.jifen_type == 2) {	//头尾肉
    		return false;
    	}
    	return this.options.drawDefine
    },
    isStartDing() {
    	if (this.pkConfig.type == 5 && this.pkConfig.jifen_type == 2) {	//头尾肉
    		return false;
    	}
    	return this.options.startDing
    },
    
    isMinDing() {
    	if (this.pkConfig.type == 5 && this.pkConfig.jifen_type == 2) {	//头尾肉
    		return false;
    	}
    	return this.options.minDing
    },
    isMinFlag() {
    	if (this.pkConfig.type == 5 && this.pkConfig.jifen_type == 2) {	//头尾肉
    		return false;
    	}
    	return this.options.minFlag
    },
    isBangStyle() {
    	return this.options.bangStyle && this.pkConfig.type == 5 && this.pkConfig.baodong == 0
    },
    isDaShou() {
      if (this.pkConfig.type == 4 && this.pkConfig.jifen_type != 0) {	//斗地主-123计分才有打手
      	return false;
      }
      return this.options.daShou
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/pages/pk/pk-rules-setting/styles/index.scss';
</style>