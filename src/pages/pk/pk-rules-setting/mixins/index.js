/*
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
 */

// vuex
import { mapState, mapMutations } from 'vuex';
import { mutationsTypes } from '@/store/modules/pk/types';

export default {
  computed: {
    ...mapState({
      competitionData: (state) => state.chatRoom.competitionData, // 球局信息
      pkConfig: (state) => state.pk.pkConfig // pk规则设置
    })
  },

  methods: {
    ...mapMutations([mutationsTypes.SET_PK_CONFIG_ITEM,mutationsTypes.SET_PK_KEY]),
  },
};

