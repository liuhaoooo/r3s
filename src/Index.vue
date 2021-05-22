<template>
  <div>
    <div 
    class="index-home" 
    :style="{ 'background-image':  'url(' + require('./assets/images/backgroundImg/'+backgroundImage+'.png') + ')'}">
      <div class="header">
        <div class="header-content">
          <div class="logo-content">
            <img src="./assets/images/image_logo.png" alt />
            <div class="logo-content-right">
              <span for="">{{deviceInfo.board_type || "RAX3000-Q"}}</span>
              <p>智能组网终端</p>
            </div>
          </div>
          <input type="color" @change="changeColor" v-model="color" v-show="!unLogin&&account_level=='1'"/>
          <a-select size="small" style="width:120px" @change="selectTheme" v-model="backgroundImage" v-show="!unLogin&&account_level=='1'">
            <a-select-option v-for="(item,index) in themeOption" :key="index" :value="item.value">
              <div class="themeSelect-item"><div :style="'backgroundColor:'+item.color"></div>{{ item.name }}</div>
            </a-select-option>
          </a-select>
          <div v-if="!unLogin && !isMore">
            <a-button
              class="logout"
              type="primary"
              icon="reload"
              @click="reset"
              >{{ $t("home.reset") }}</a-button
            >
            <a-button
              class="logout"
              type="primary"
              icon="sync"
              @click="restart"
              >{{ $t("home.restart") }}</a-button
            >
            <a-button
              class="logout"
              type="primary"
              icon="logout"
              @click="logout"
              >{{ $t("home.logout") }}</a-button
            >
          </div>
          <a-button
            v-else-if="!unLogin"
            class="logout"
            type="primary"
            icon="arrow-left"
            @click="backToHome"
            >返回主页</a-button
          >
        </div>
      </div>
      <div style="height: 170px" v-show="unLogin"></div>
      <router-view />
      <div class="index-footer">
        <span>
          软件版本: <a>{{ account_level=='1' ? deviceInfo.real_fwversion : deviceInfo.fake_version }}</a> 
          MAC地址: <a>{{ networkInfo.wan_mac || "----------" }}</a>
        </span>
        <span>{{deviceInfo.device_firm}} | 服务热线: 400-19-10086</span>
      </div>
    </div>
    <myLoading />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import store from "./store";
import myLoading from "./components/myLoading.vue";
import { logout_tool, restart_tool, reset_tool } from "./utils/tools.js";
const themeOption = [
  { name: "默认主题", value: "bg_default", color:"#16cdab" },
  { name: "蓝色主题", value: "bg_blue", color:"#0c62de" },
  { name: "橙色主题", value: "bg_orange", color:"#ea9e1a" }
]
const colorOption = {
  "bg_default":"#16cdab",
  "bg_blue":"#0c62de",
  "bg_orange":"#ea9e1a"
}
export default {
  components: {
    myLoading,
  },
  data() {
    return {
      color: "#16cdab",
      backgroundImage:"bg_default",
      themeOption
    };
  },
  computed: {
    unLogin() {
      return this.$route.name == "Login";
    },
    account_level: () => store.getters["sysStatus/account_level"],
    deviceInfo: () => store.getters["sysStatus/deviceInfo"],
    ...mapState("sysStatus", {
      networkInfo: (state) => state.networkInfo,
      isMore: (state) => state.isMore,
    }),
  },
  mounted() {
    store.dispatch("sysStatus/getConfigInfo"); //获取配置信息
    store.dispatch("sysStatus/getDeviceInfo"); //获取设备信息
    store.dispatch("sysStatus/getNetworkInfo"); //获取设备信息
  },
  methods: {
    changeColor(e){
      this.changeTheme(e.target.value)
    },
    selectTheme(e){
      this.changeTheme(colorOption[e])
      this.color = colorOption[e]
    },
    //主题色切换
    changeTheme(color) {
      store.commit("sysStatus/setThemeColor",color)
      window.less
        .modifyVars({
          "@themeColor": color,
          "@primary-color": color,
          "@link-color": color,
        })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    },
    logout() {
      logout_tool(this.$t("tips.logout"));
    },
    restart() {
      restart_tool(this.$t("tips.restart"));
    },
    reset() {
      reset_tool(this.$t("tips.reset"));
    },
    backToHome(){
      store.commit("sysStatus/setIsMore",false)
      this.$router.push({ name: "Simple_home" })
    }
  },
};
</script>
<style lang="less" scpoed>
  .themeSelect-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    >div{
      width: 15px;
      height: 15px;
      margin-right: 5px;
      border-radius: 2px;
    }
  }
</style>