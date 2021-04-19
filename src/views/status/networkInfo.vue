<template>
  <div>
    <a-descriptions layout="vertical" bordered :column="4">
      <a-descriptions-item :label="$t('device_status.workingMode')">{{mode_arr[networkInfo.work_mode] || "------"}}</a-descriptions-item>
      <a-descriptions-item :label="$t('device_status.wanip')">{{networkInfo.real_wan_ip || "------"}}</a-descriptions-item>
      <a-descriptions-item :label="$t('device_status.wanmac')">{{networkInfo.wan_mac || "------"}}</a-descriptions-item>
      <a-descriptions-item :label="'LAN IP 地址'">{{networkInfo.lan_ip_v4 || "------"}}</a-descriptions-item>
      <!-- <a-descriptions-item :label="'IPv4 DNS 服务器'">{{"------"}}</a-descriptions-item>
      <a-descriptions-item :label="'IPv4 默认网关'">{{"------"}}</a-descriptions-item>
      <a-descriptions-item :label="'IPv6 WAN IP 地址'">{{"------"}}</a-descriptions-item>
      <a-descriptions-item :label="'IPv6 链路本地地址'">{{"------"}}</a-descriptions-item>
      <a-descriptions-item :label="'IPv6 默认网关'">{{"------"}}</a-descriptions-item>
      <a-descriptions-item :label="'IPv6 DNS 服务器'">{{"------"}}</a-descriptions-item>
      <a-descriptions-item :label="'IPv6 前缀'">{{"------"}}</a-descriptions-item> -->
    </a-descriptions>
  </div>
</template>

<script>
import store from "../../store";
import { mapActions, mapState, mapGetters } from "vuex";
const mode_arr = {
  Mesh: "组网模式",
  Bridge: "桥模式",
  Route: "路由模式",
  APClient: "无线中继模式",
  no: "WAN口未连接",
};
export default {
  data() {
    return {
      mode_arr,
    };
  },
  computed: {
    ...mapState("sysStatus", {
      networkInfo: (state) => state.networkInfo,
    }),
  },
};
</script>