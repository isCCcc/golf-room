<!--
 * @Author: simon
 * @Description: 杆洞
 * @LastEditors: simon
-->
<template>
  <view>
    <view class="h-120 flex border-b"
          v-for="(item,index) in ganList"
          :key="item.key">
      <GCell className="plr-32"
             :label="item.label"
             isLink
             class="flex1"
             iconSize="36rpx"
             @click.native="handleShow(item,index)">
        <view class="flex-end h-120 mr-10">
          <view class="col-999 fs-24 fw-400 cell-name"> {{currentLabel(item.type)}} </view>
        </view>
      </GCell>
    </view>

    <ActionModal ref="actionModal"
                 :list="actionList"
                 @onClick="getAction" />
    <!-- /操作列表 -->
  </view>
</template>

<script>
// 组件
import GCell from '@components/g-cell/index.vue';
import ActionModal from './action-modal';
// mixins
import PkMixins from '../mixins/index';

import { mapState } from 'vuex'

export default {
  mixins: [PkMixins],
  components: {
    GCell,
    ActionModal
  },
  data() {
    return {
      ossUrl: `${this.$ossUrl}/images/pk/icons`,
      // 杆洞列表
      ganList: [
        { label: '3杆洞', type: 0, key: 'rang3' },
        { label: '4杆洞', type: 0, key: 'rang4' },
        { label: '5杆洞', type: 0, key: 'rang5' }
      ],
      // 操作列表
      actionList: [
        { type: 0, label: '不让杆' },
        { type: 1, label: '让0.5杆' },
        { type: 2, label: '让1杆' },
        { type: 3, label: '让1.5杆' },
        { type: 4, label: '让2杆' }
      ],
      editIndex: -1
    };
  },
  computed: {
    ...mapState({
      pkConfig: state => state.pk.pkConfig
    }),
    // 杆洞
    currentLabel() {
      return (type) => {
        let target = this.actionList.find((e) => e.type == type);
        return target.label;
      };
    }
  },

  mounted() {
    this.init(this.pkConfig)
  },

  methods: {
    init(val) {
      this.ganList.forEach(e => {
          if(val[e.key]) {
            e.type = val[e.key]
          }
        })
    },
    // 获取操作信息
    getAction({ type }) {
      let target = this.ganList[this.editIndex];
      target.type = type;
      this.SET_PK_CONFIG_ITEM({ key: target.key, data: type });
      this.$refs.actionModal.close();
    },
    // 显示
    handleShow({ type }, index) {
      this.editIndex = index;
      this.$refs.actionModal.open(type);
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-name {
  margin-top: -7rpx;
}
.left-icon {
  margin-right: 13rpx;
  width: 40rpx;
}
</style>
