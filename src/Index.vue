<template>
  <div>
    <div class="index-home" :style="{ 'background-image':  'url(' + require('./assets/images/bg@3x.png') + ')'}">
      <div class="header">
        <div class="header-content">
          <div class="logo-content">
            <img src="./assets/images/image_logo.png" alt />
            <div class="logo-content-right">
              <span for="">Rs3-4</span>
              <p>智能组网终端</p>
            </div>
          </div>
          <input type="color" @change="changeTheme" v-model="color" v-show="!unLogin&&account_level=='1'"/>
          <a-select default-value="zh" @change="langChange" style="width:120px" v-show="!unLogin&&account_level=='1'">
            <a-select-option value="zh">简体中文</a-select-option>
            <a-select-option value="en">English</a-select-option>
          </a-select>
          <div v-show="!unLogin">
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
        </div>
      </div>
      <div style="height: 170px" v-show="unLogin"></div>
      <router-view />
      <div class="index-footer">
        <span>
          软件版本: <a>{{ deviceInfo.fake_version || "----------" }}</a> 
          MAC地址: <a>{{ networkInfo.wan_mac || "----------" }}</a>
        </span>
        <span>中国移动通信集团终端有限公司 | 服务热线: 400-19-10086</span>
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
export default {
  components: {
    myLoading,
  },
  data() {
    return {
      color: "#16cdab",
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
    }),
  },
  mounted() {
    store.dispatch("sysStatus/getConfigInfo"); //获取配置信息
  },
  methods: {
    changeTheme(e) {
      let color = e.target.value;
      store.commit("sysStatus/setThemeColor",color)
      window.less
        .modifyVars({
          "@themeColor": color,
          "@primary-color": color,
          "@link-color": color,
          "@heading-color": color,
        })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    },
    langChange(lang) {
      this.$i18n.locale = lang;
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
  },
};
</script>