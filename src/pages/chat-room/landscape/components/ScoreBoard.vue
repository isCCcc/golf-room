<template>
  <view class="scoreboard-wrap" :style="{width: (cellWidth * 22 + 48) + 'px'}">
    <!-- S 计分板 -->
    <view class="table-wrapper fs-10 flex trans">
      <!-- S 左边 -->
      <view class="table-left">
        <view class="left-th-cell flex">
          <view>
            <view class="sub-color mb-5">HOLE</view>
            <view class="op-5 lh-1">PAR</view>
          </view>
        </view>
        <view v-for="com in competitorList"
              :key="com.competitor_id"
              class="left-td-cell pr">
          <view class="tc">
            <view class="g-avatar table-avatar"
                :style="{ backgroundImage: com.avatar_url ? `url(${com.avatar_url })` : ''}"></view>
          </view>
          <view class="tc text-over fs-10 fw-400" :style="{color: 'rgba(255, 255, 255, 0.7)'}">{{ com.username }}</view>
          <view class="tee-wrapper"
                :style="{backgroundColor: teeColor(com.tee)}"></view>
        </view>
      </view>
      <!-- E 左边 -->
    
      <!-- S 右边 -->
      <view class="table-right-wrapper"
            id="table-right-wrapper"
            catchtouchmove="return">
        <view class="table-right-content">
          <!-- S 球洞编号 -->
          <view class="right-th-wrapper flex">
            <view class="flex"
                  v-for="(court,cindex) in holeList"
                  :key="cindex">
              <view class="right-th-cell flex-center"
                    :style="{width: cellWidth + 'px'}"
                    v-for="(hole,hindex) in court.grCourseHole"
                    :key="hindex"
                    :id="`hole-cell-${hole.course_half_court_id}-${hole.hole_no}`">
                <HoleCell :hole="hole" :landscape="true" />
              </view>
              <view class="right-th-cell flex-center th-half" :style="{width: cellWidth + 'px'}">
                <view class="tc">
                  <view class="hole-no op-5">
                    <text>{{cindex > 0 ? 'IN' : 'OUT'}}</text>
                  </view>
                  <view class="fs-14 lh-1 op-5">{{court.totalPar}}</view>
                </view>
              </view>
            </view>
            <view class="right-th-cell flex-center th-diff" :style="{width: cellWidth + 'px'}">
              <view class="tc">
                <view class="hole-no op-5">
                  <text>总差</text>
                </view>
                <view class="op-5 fs-14 lh-1">0</view>
              </view>
            </view>
            <view class="right-th-cell flex-center th-total-score" :style="{width: cellWidth + 'px'}">
              <view class="tc sub-color">
                <view class="hole-no">
                  <text>总杆</text>
                </view>
                <view class="fs-14 lh-1">{{competitionData.total_score}}</view>
              </view>
            </view>
          </view>
          <!-- E 球洞编号 -->
    
          <!-- S 洞分 -->
          <view v-for="(com,cindex) in competitorList"
                :key="com.competitor_id"
                class="flex right-tr-cell">
            <view class="flex-center right-td-cell"
                  :class="{'unusual': record.unusual}"
                  :style="{width: cellWidth + 'px'}"
                  v-for="(record,rindex) in com.record"
                  :key="record.competition_record_id">
              <template v-if="record.type === 'half'">
                <view class="flex-center w-auto h-auto"
                      :class="[`td-half-${cindex}`]">
                  <view class="fs-16 col-sub">
                    {{record.totalHalfScore > 0 ? '+' : ''}}{{ record.totalHalfScore }}
                  </view>
                </view>
              </template>
              <template v-else>
                <!-- S loading -->
                <view class="dots-loading"
                      v-if="record.loading">
                  <view class="dots-view"></view>
                  <view class="dots-view"></view>
                  <view class="dots-view"></view>
                </view>
                <!-- E loading -->
                <RecordCell :record="record"
                            :landscape="true"
                            v-else />
              </template>
    
            </view>
            <!-- S 总差 -->
            <template>
              <view class="flex-center right-td-cell" :style="{width: cellWidth + 'px'}">
                <view class="flex-center w-auto h-auto"
                      :class="[`td-diff-${cindex}`]">
                  <view class="fs-15 col-sub">
                    {{com.totalDiff > 0 ? '+' : ''}}{{com.totalDiff === null ?  '' : com.totalDiff}}
                  </view>
                </view>
              </view>
            </template>
            <!-- E 总差 -->
    
            <!-- S 总杆 -->
            <template>
              <view class="flex-center right-td-cell" :style="{width: cellWidth + 'px'}">
                <view class="flex-center w-auto h-auto td-total-score">
                  <view class="fs-15" :class="{ 'op-5': com.totalFlag == false}">
                    {{com.total_score}}
                  </view>
                </view>
              </view>
            </template>
            <!-- E 总杆 -->
          </view>
          <!-- E 洞分 -->
    
        </view>
      </view>
      <!-- E 右边 -->
    </view>
    <!-- E 计分板 -->
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import HoleCell from '@/pages/chat-room/index/components/hole-cell'
import RecordCell from '@/pages/chat-room/index/components/record-cell'

export default {
  props: ['cellWidth'],
  components: {
    HoleCell,
    RecordCell
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['getTeeColorList']),
    ...mapState({
      competitionData: (state) => state.chatRoom.competitionData,
      isNowGroup: (state) => state.chatRoom.isNowGroup || 'A'
    }),
    // 当前分组球员信息
    competitorList() {
      return this.competitionData?.competitor_list?.filter(
          (item) => item.group === this.isNowGroup
        ) || []
    },
    // 球洞信息
    holeList() {
      return this.competitionData.hole_list
    },
    // 会员tee颜色
    teeColor() {
      return function (tee) {
        let teeTarget = this.getTeeColorList.find((e) => e.value == tee)
        return (teeTarget && teeTarget.color) || 'transparent'
      };
    }
  }
}
</script>

<style lang="scss" scoped>
  .scoreboard-wrap {
    .fs-10 {
      font-size: 10px;
    }
    .fs-14 {
      font-size: 14px;
    }
    .fs-15 {
      font-size: 15px;;
    }
    .fs-16 {
      font-size: 16px;
    }
    // S 计分板样式1
    .table-wrapper {
      border-left: 2px solid $sub-color;
      background-image: url('https://golf-room.oss-cn-beijing.aliyuncs.com/wx-golf-room/images/bg-scoreboard.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      overflow: hidden;
      color: #fff;
      .table-left {
        width: 48px;
        flex: 0 0 48px;
        box-sizing: border-box;
        .left-th-cell {
          padding-left: 12px;
          height: 41px;
          @include rubikVar();
        }
        .left-td-cell {
          height: 50px;
          box-sizing: border-box;
          padding: 10px 0;
          &:nth-child(even) {
            background: rgba($color: $bg-col-f5, $alpha: 0.1);
          }
          // 头像
          .table-avatar {
            display: block;
            margin: 0 auto;
            width: 22px;
            height: 22px;
          }
    
          // tee
          .tee-wrapper {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 2px;
          }
          // 总分
          .score-wrapper {
            width: 45px;
            height: 22px;
            margin-left: 11px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 103.85%);
          }
        }
      }
      .table-right-wrapper {
        flex: 1;
        overflow-x: auto;
      }
      .table-right-content {
        width: 100%;
        white-space: nowrap;
        .right-th-cell {
          width: 36px;
          height: 41px;
          @include rubikVar();
          .hole-no {
            margin-bottom: 2px;
          }
        }
        .right-td-cell {
          position: relative;
          width: 36px;
          height: 100%;
          box-sizing: border-box;
          @include rubikVar();
          .circle {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .right-tr-cell {
          height: 50px;
          box-sizing: border-box;
          .td-total-score {
            background-color: rgba($color: #1e3e42, $alpha: 1);
          }
          &:nth-child(even) {
            background: rgba($color: $bg-col-f5, $alpha: 0.1);
            .td-total-score {
              background-color: rgba($color: #1e3e42, $alpha: 0.5);
            }
          }
        }
    
        .bg-op1 {
          background: rgba($color: $bg-col-f5, $alpha: 0.1);
        }
        // 网络异常样式
        .unusual {
          background-color: yellow;
          color: red;
          border-right: 1px solid #000;
        }
      }
    }
    // E 计分板样式1
    
    // S 计分板样式2
    // 半场的渐变色
    .th-half,
    .td-half-0,
    .td-half-1 {
      background: linear-gradient(
        180deg,
        rgba(149, 209, 113, 0.1) 100%,
        rgba(149, 209, 113, 0.1) 100%
      );
    }
    
    .td-half-2,
    .td-half-3,
    .th-diff,
    .td-diff-0,
    .td-diff-1 {
      background: linear-gradient(
        180deg,
        rgba(149, 209, 113, 0.2) 100%,
        rgba(149, 209, 113, 0.2) 100%
      );
    }
    
    .td-diff-2,
    .td-diff-3 {
      background: linear-gradient(
        180deg,
        rgba(149, 209, 113, 0.4) 100%,
        rgba(149, 209, 113, 0.4) 100%
      );
    }
    .th-total-score {
      background-color: $col-1e3;
    }
    
    // E 计分板样式2
  }
</style>
