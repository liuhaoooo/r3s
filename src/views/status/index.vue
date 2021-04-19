<template>
  <div class="my_content">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card hoverable size="small" :title="'2.4G Wi-Fi（'+authentication[wifiInfo_24.authenticationType]+'）'">
          <a slot="extra" @click="$router.push({name:'Wifi24g'})">详情</a>
          <a-statistic
            :title="`SSID广播：${wifiInfo_24.broadcast=='1'?'开启':'关闭'}`"
            :value="wifiInfo_24.wifiOpen=='1'?networkInfo.wifiName_4g:'已关闭'"
            :value-style="{ color: wifiInfo_24.wifiOpen=='1'?themeColor:'#ffa0a2' }"
          >
            <template #prefix>
              <a-icon type="wifi" />
            </template>
          </a-statistic>
          <div v-show="!showPwd24">
            <a-icon type="eye-invisible" class="wifi-eye" @click="showPwd24=true"/>
            Wi-Fi密码：********
          </div>
          <div v-show="showPwd24">
            <a-icon type="eye" class="wifi-eye" @click="showPwd24=false"/>
            Wi-Fi密码：{{(wifiInfo_24.wifiOpen=='0' || wifiInfo_24.authenticationType=='0')?'无':wifiInfo_24.key}}
          </div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card hoverable size="small" :title="'5G Wi-Fi（'+authentication[wifiInfo_5.authenticationType]+'）'">
          <a slot="extra" @click="$router.push({name:'Wifi5g'})">详情</a>
          <a-statistic
            :title="`SSID广播：${wifiInfo_5.broadcast=='1'?'开启':'关闭'}`"
            :value="wifiInfo_5.wifiOpen=='1'?networkInfo.wifiName_5g:'已关闭'"
            :value-style="{ color: wifiInfo_5.wifiOpen=='1'?themeColor:'#ffa0a2' }"
          >
            <template #prefix>
              <a-icon type="wifi" />
            </template>
          </a-statistic>
          <div v-show="!showPwd5">
            <a-icon type="eye-invisible" class="wifi-eye" @click="showPwd5=true"/>
            Wi-Fi密码：********
          </div>
          <div v-show="showPwd5">
            <a-icon type="eye" class="wifi-eye" @click="showPwd5=false"/>
            Wi-Fi密码：{{ (wifiInfo_5.wifiOpen=='0' || wifiInfo_5.authenticationType=='0')?'无':wifiInfo_5.key}}
          </div>
        </a-card>
      </a-col>
    </a-row>
    <!-- 系统信息 -->
    <sysInfo />
    <!-- 网络信息 -->
    <networkInfo />
    <!-- 设备列表 -->
    <deviceList />
  </div>
</template>
<script>
import store from "../../store";
import { mapActions, mapState, mapGetters } from "vuex";
import deviceList from "./deviceList.vue";
import networkInfo from "./networkInfo.vue";
import sysInfo from "./sysInfo.vue";
import { authentication } from "../network/wifiSetOption.js";
export default {
  components: {
    deviceList,
    networkInfo,
    sysInfo,
  },
  data(){
    return{
      showPwd24:false,
      showPwd5:false,
      authentication
    }
  },
  computed: {
    ...mapState("sysStatus", {
      networkInfo: (state) => state.networkInfo,
      wifiInfo_24: (state) => state.wifiInfo_24,
      wifiInfo_5: (state) => state.wifiInfo_5,
      themeColor: (state) => state.themeColor,
    })
  },
};
</script>