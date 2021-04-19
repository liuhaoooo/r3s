<template>
  <div class="home-main">
    <a-popover
      v-model="qrcodeShow"
      trigger="click"
      class="qrcode"
      placement="rightTop"
    >
      <a slot="content" @click="qrcodeShow = !qrcodeShow">
        <img src="../assets/images/image_qrcode.png" alt style="width: 120px" />
      </a>
      <a style="color: #41a5e0">手机客户端</a>
    </a-popover>
    <div class="main-header">
      <div
        :class="selectIndex == index ? 'animate__animated animate__bounceIn menu-select' : ''"
        :style="selectIndex == index ? 'background:' + item.color : ''"
        v-for="(item, index) in meun"
        :key="index"
        @click="meunClick(index, item)"
      >
        <div
          :style="'background:' + item.color"
          v-if="selectIndex != index"
        ></div>
        {{ $t("headerMeun." + item.title) }}
      </div>
    </div>
    <div class="main-content">
      <transition
        :duration="{ enter: 180, leave: 100 }"
        mode="out-in"
        :enter-active-class="`animate__animated ${enter_active_class}`"
        :leave-active-class="`animate__animated ${leave_active_class}`"
      >
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import store from "../store";
export default {
  data() {
    return {
      meun: [
        { title: "status", color: "#f8b503", route: "Status" },
        { title: "net", color: "#0092ff", route: "Network" },
        { title: "safe", color: "#6ed400", route: "Secure" },
        { title: "manage", color: "#b620e2", route: "Manage" },
        { title: "diagnosis", color: "#31c5ff", route: "Diagnosis" },
        { title: "help", color: "#2bbe8f", route: "Help" },
      ],
      selectIndex: 0,
      qrcodeShow: true,
      enter_active_class: "",
      leave_active_class: "",
    };
  },
  computed: {
    deviceInfo: () => store.getters["sysStatus/deviceInfo"],
  },
  mounted() {
    store.dispatch("sysStatus/getDeviceInfo")
    store.dispatch("sysStatus/getNetworkInfo"); //网络状态
    store.dispatch("sysStatus/getWifiInfo"); //wifi信息
    store.dispatch("sysStatus/getConfigInfo"); //获取配置信息
    store.dispatch("sysStatus/getMeshStatus"); //获取mesh状态
    store.dispatch("sysStatus/getNetworkInfo_post"); //更新vuex状态
    this.selectIndex = this.$route.meta.id;
    clearInterval(window.logintatus_Interval);
    window.logintatus_Interval = setInterval(() => {
      this.$axiosRequest_get({ cmd: this.$CMD.GET_DEVICE_NAME });
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(window.logintatus_Interval);
  },
  methods: {
    meunClick(index, item) {
      if (index != this.selectIndex) {
        this.selectIndex = index;
        this.$router.push({ name: item.route });
      }
    },
  },
  watch: {
    $route: {
      handler(to, from) {
        this.selectIndex = to.meta.id;
        if (from != undefined) {
          if (from.meta.id < to.meta.id) {
            this.enter_active_class = "animate__slideInRight";
            this.leave_active_class = "animate__slideOutLeft";
          } else {
            this.enter_active_class = "animate__slideInLeft";
            this.leave_active_class = "animate__slideOutRight";
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>