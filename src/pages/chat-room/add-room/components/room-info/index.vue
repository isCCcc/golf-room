<!--
 * @Author: simon
 * @Description: 
 * @LastEditors: simon
-->
<template>
  <view class="box g-reset">
    <uni-forms ref="form"
               :model="formData">
      <uni-forms-item>
        <view class="border-b h-120 flex">
          <GCell className="plr-32"
                 label="球局名称"
                 :isLink="!disabled"
                 class="flex1">
            <view class="m-input fs-28 fw-400 text-over"
                  :class="formData.competition_name ? 'col-black' : 'col-999'"
                  @tap="handelShowName">
              {{ formData.competition_name || '请输入球局名称' }}
            </view>
          </GCell>
        </view>
      </uni-forms-item>
      <UniFormsItem>
        <view class="border-b h-120 flex">
          <GCell className="plr-32"
                 label="球场"
                 :isLink="!disabled"
                 class="flex1">
            <view class="m-input fs-28 fw-400 text-over"
                  :class="formData.course_name ? 'col-black' : 'col-999'"
                  @tap="goCourt">
              {{ displayCourseName || '请选择球场' }}
            </view>
          </GCell>
        </view>
      </UniFormsItem>
      <UniFormsItem>
        <view class="border-b h-120 flex">
          <GCell className="plr-32"
                 label="开球时间"
                 :isLink="!disabled"
                 class="flex1">
            <view class="m-input fs-28 fw-400 text-over"
                  :class="displayTime ? 'col-black' : 'col-999'"
                  @tap="handelShowTime">
              {{ displayTime || '请选择开球时间' }}
            </view>
          </GCell>
        </view>
      </UniFormsItem>
      <view class="h-120 flex">
        <GCell className="plr-32"
               label="是否私密"
               :isLink="false"
               class="flex1">
          <template #right>
            <switch class="g-switch" 
                    :checked="!!formData.is_private"
                    :disabled="disabled"
                    color="#003C3D"
                    @change="onChangeSwitch"></switch>
          </template>
        </GCell>
      </view>
    </uni-forms>

    <InputPopup ref="inputPopupRef"
                label="球局名称"
                placeholder="这里编辑球局名称"
                :value="formData.competition_name"
                @confirm="onConfirmName" />

    <GDatetimePicker ref="datetimePickerRef"
                     :value="formData.start_time"
                     @confirm="onConfirmTime" />
  </view>
</template>

<script>
import GCell from '@components/g-cell/index.vue';
import GDatetimePicker from '@components/g-datetime-picker/index.vue';
import UniForms from '@components/uni-forms/uni-forms.vue';
import UniFormsItem from '@components/uni-forms-item/uni-forms-item.vue';
import InputPopup from '@components/common/input-popup/index';
import { formatDate } from '@/utils';

import { mapState } from 'vuex';

export default {
  components: {
    GCell,
    GDatetimePicker,
    UniForms,
    UniFormsItem,
    InputPopup
  },
  props: {
    disabled: {
      type: Boolean
    },
    // 类型 new创建 edit修改
    roomType: {
      type: String
    }
  },
  data() {
    return {
      formData: {
        competition_name: '',
        start_time: '',
        is_private: 0,
        course_id: '',
        course_half_court_ids: '',
        course_name: ''
      },
      courseHalfCourtNames: []
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      competitionData: (state) => state.chatRoom.competitionData // 球局详情
    }),
    displayTime() {
      const { start_time: time } = this.formData;
      return time ? formatDate(time, 'yyyy年MM月dd日 hh:mm') : '';
    },
    displayCourseName() {
      const { course_name } = this.formData;
      if (!course_name) return '';

      const halfNames = this.courseHalfCourtNames;
      return halfNames?.length
        ? `${course_name}·${halfNames.join('&')}`
        : course_name;
    }
  },
  mounted() {
    let typeData = {
      new: this.newInit,
      edit: this.editInit
    };
    typeData[this.roomType]();
  },
  methods: {
    // 编辑初始化
    editInit() {
      let { competition_name, start_time, is_private, course_half_court_count,hole_list } =
        this.competitionData;
      this.formData.competition_name = competition_name;
      this.formData.start_time = start_time;
      this.formData.is_private = is_private;
      if (course_half_court_count > 2) {
        this.competitionData.course_half_court_names = hole_list.map(
          (e) => e.half_court_name
        );
      }
      this.dataInit(this.competitionData);
      this.dataOn();
    },
    // 创建初始化数据
    newInit() {
      if (this.userInfo?.username) {
        this.formData.competition_name = `${this.userInfo.username}的球局`;
      }
      this.dataOn();
    },
    dataOn() {
      this.onGREvent('selectCourse', (data) => {
        this.dataInit(data);
      });
    },
    // 数据初始化
    dataInit(data) {
      this.formData.course_id = data.course_id;
      this.formData.course_name = data.course_name;
      this.formData.course_half_court_ids = data.course_half_court_ids;
      this.courseHalfCourtNames = data.course_half_court_names || [];
      console.log(data.course_half_court_names);
    },
    handelShowName() {
      if (this.disabled) return;
      this.$refs.inputPopupRef.open();
    },
    onConfirmName(value) {
      this.formData.competition_name = value;
      this.$refs.inputPopupRef.close();
    },
    handelShowTime() {
      if (this.disabled) return;
      this.$refs.datetimePickerRef.open();
    },
    // 选择时间
    onConfirmTime(value) {
      console.log('时间', value);
      this.formData.start_time = value;
      this.$refs.datetimePickerRef.close();
    },
    onChangeSwitch({ detail: { value } }) {
      this.formData.is_private = Number(value);
    },
    goCourt() {
      if (this.disabled) return;
      uni.navigateTo({ url: '/pages/common/court/index' });
    },
    async validate() {
      const toast = (title) => uni.showToast({ title, icon: 'none' });

      const { competition_name, course_id, start_time } = this.formData;

      if (!competition_name) {
        toast('请输入球局名称');
        return Promise.reject();
      }

      if (!course_id) {
        toast('请选择球场');
        return Promise.reject();
      }

      if (!start_time) {
        toast('请选择开球时间');
        return Promise.reject();
      }

      return this.formData;
    }
  }
};
</script>

<style lang="scss">
::v-deep .uni-forms-item {
  margin-bottom: 0;
}

.box {
  background: $white;
  box-shadow: 0px 4rpx 30rpx rgba(57, 80, 69, 0.08);
  border-radius: 4rpx;
}
.h-120 {
  height: 120rpx;
}
.m-input {
  padding: 0 0rpx 0rpx 20rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: right;
}
</style>
