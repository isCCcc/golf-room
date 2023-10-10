<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: superJane
-->
<template>
  <view class="wrapper mb-32">
    <!-- S 选手 -->
    <Players v-if="isPlayers"
             :rangGan="options.rangGan"
             :showNumber="options.showNumber"></Players>
    <!-- E 选手 -->

    <!-- S 批量哪些人？ -->
    <BatchPlayers v-if="isBatchPlayers" />
    <!-- E 批量哪些人？ -->

    <!-- S 分类 打老虎 -->
    <FenleiTiger v-if="isFenleiTiger" />
    <!-- E 分类 打老虎 -->

    <TigerPlayers v-if="isTigerPlayers" />

    <!-- S 每洞让杆 -->
    <AllowHole v-if="isAllowHole"></AllowHole>
    <!-- E 每洞让杆 -->

    <!-- S 让分 -->
    <Handicap v-if="isHandicap"></Handicap>
    <!-- E 让分 -->
    
    <!-- S 选地主 -->
    <Xuandizhu v-if="isXuandizhu"></Xuandizhu>
    <!-- E 选地主 -->

    <!-- S 计分 -->
    <Scoring v-if="isScoring"></Scoring>
    <!-- E 计分 -->

    <!-- S 单让 -->
    <ContentDanrang v-if="isDanrang"></ContentDanrang>
    <!-- E 单让 -->

    <!-- S 扣分 -->
    <!-- <DeductPoints v-if="isDeductPoints"></DeductPoints> -->
    <ScoreRules v-if="isScoreRules" />
    <!-- E 扣分 -->

  </view>
</template>
<script>
// components
import Players from '@pages/pk/pk-rules-setting/components/players';
import Handicap from '@pages/pk/pk-rules-setting/components/handicap';
import AllowHole from '@pages/pk/pk-rules-setting/components/allow-hole';
import FenleiTiger from '@/pages/pk/pk-rules-setting/components/fenlei-tiger';
import TigerPlayers from '@/pages/pk/pk-rules-setting/components/tiger-players';
import BatchPlayers from '@/pages/pk/pk-rules-setting/components/batch-players';
import Xuandizhu from '@/pages/pk/pk-rules-setting/components/xuan-di-zhu';

// import DeductPoints from '@pages/pk/pk-rules-setting/components/deduct-points';
import Scoring from '@pages/pk/pk-rules-setting/components/scoring';
import ContentDanrang from './content-danrang.vue';
import ScoreRules from '@/pages/pk/pk-rules-setting/components/score-rules';
import { mapState } from 'vuex';
// mixins
import PkMixins from '../mixins/index';

export default {
  components: {
    Players,
    Handicap,
    AllowHole,
    // DeductPoints,
    Scoring,
    ContentDanrang,
    ScoreRules,
    FenleiTiger,
    TigerPlayers,
    BatchPlayers,
    Xuandizhu
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
    ...mapState({
      batchType: (state) => state.pk.batchType // 批量类型
    }),
    isPlayers() {
      return this.options.players && !this.batchType;
    },
    isAllowHole() {
      return this.options.allowHole;
    },
    isHandicap() {
      return this.options.handicap;
    },
    isDeductPoints() {
      return this.options.deductPoints;
    },
    isScoring() {
      if (this.pkConfig.type == 4 && this.pkConfig?.sub_type == 0) {
        return false;
      }
      return this.options.scoring;
    },
    isDanrang() {
      return this.options.danRang;
    },
    isScoreRules() {
      return this.options.scoreRules;
    },
    // 分类 打老虎
    isFenleiTiger() {
      return this.options.fenleiTiger;
    },
    // 打老虎参赛者
    isTigerPlayers() {
      return this.options.tigerPlayers;
    },
    // 是否是批量
    isBatchPlayers() {
      return !!this.batchType;
    },
	//选地主
	isXuandizhu() {
    if (this.pkConfig.type == 4 && this.pkConfig?.sub_type == 0) {
      return false;
    }
		return this.options.xuandizhu;
	}
  }
};
</script>
<style lang="scss" scoped>
@import '../styles/index.scss';
</style>
