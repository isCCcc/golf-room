/*
 * @Author: simon
 * @Description: 监听设备网络状态
 * @LastEditors: simon
 */
import store from "@store";
import { runTasks } from '@utils/error-task/index';

// 获取网络连接状态
export function getNetwork() {
  uni.getNetworkType({
    success: function ({networkType}) {
      console.log('getNetwork', networkType);
      let status = true;
      if(networkType === 'none') {
        status = false;
      }
      store.commit('SET_NET_CONFIG', {status, networkType});
      onNetworkListener();
    }
  });
}


// 监听网络状态
export function onNetworkListener() {
  uni.onNetworkStatusChange((res) => {
    const status = store.state.app.netConfig.status;

    store.commit('SET_NET_CONFIG', {status: res.isConnected, networkType: res.networkType});
    // 由断网转成有网
    if(!status && res.isConnected) {
      runTasks()
    }
    
  });
}

// 关闭网络监听
export function offNetworkListener() {
  uni.offNetworkStatusChange((res) => {
    // console.log("off-isConnected", res.isConnected);
    // console.log("off-networkType", res.networkType);
  });
}
// 接口网络连接异常的相关操作 推送到队列中, 网络连接成功后重新推送
