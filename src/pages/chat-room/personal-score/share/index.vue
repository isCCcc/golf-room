<template>
	<view class="content">
    <web-view :src="url" v-if="url" />
	</view>
</template>

<script>
  const holeTitle = new Map([
    [0, '前九'],
    [1, '后九']
  ]);
  
  import {
    mapGetters
  } from 'vuex';
  import {
    formatDate
  } from '@/utils'
  import {
    getCompetitorDetail
  } from '@/api/chat-room';
  
	export default {
		components:{},
		data() {
			return {
        url: ''
			}
		},
		onLoad(params) {
      this.url = `https://admin.golfroom.cn/#/share?competitor_id=${params.competitor_id}&token=${this.$store.state.user.token}&t=${new Date().getTime()}`
      console.log(params, this.url )
		},
  }
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
