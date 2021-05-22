<template>
  <div>
    <br />
    <!-- 信息 -->
    <div style="background: #fafafa; padding: 10px">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-card hoverable>
            <a-statistic
              title="运行时间"
              :value="deviceInfo.uptime"
              :value-style="{ color: '#666',fontSize:'1.2rem' }"
            >
              <template #prefix>
                <a-icon type="clock-circle" />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card hoverable>
            <a-statistic
              title="登录账号"
              :value="accountArr[account_level]"
              :value-style="{ color: '#3f8600',fontSize:'1.2rem' }"
            >
              <template #prefix>
                <a-icon type="user" />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="10">
          <div id="memory" style="width: 100%; height: 100%;"></div>
        </a-col>
      </a-row>
    </div>
    <br />
    <a-descriptions bordered>
      <a-descriptions-item label="型号">{{ deviceInfo.board_type }}</a-descriptions-item>
      <a-descriptions-item label="设备厂商">{{ deviceInfo.device_firm }}</a-descriptions-item>
      <a-descriptions-item label="SN">{{ deviceInfo.device_sn }}</a-descriptions-item>
      <a-descriptions-item label="软件版本">{{ account_level=='1'?deviceInfo.real_fwversion:deviceInfo.fake_version }}</a-descriptions-item>
      <a-descriptions-item label="硬件版本">{{ deviceInfo.hwversion }}</a-descriptions-item>
      <a-descriptions-item label="CMEI">{{ deviceInfo.device_cmei }}</a-descriptions-item>
      <!-- 超级账户显示 -->
      <template v-if="account_level=='1'">
        <a-descriptions-item label="配置版本">{{ deviceInfo.config_version }}</a-descriptions-item>
        <a-descriptions-item label="编译时间">{{deviceInfo.build_date}}</a-descriptions-item>
        <a-descriptions-item label="git 分支">{{ deviceInfo.git_branch }}</a-descriptions-item>
        <a-descriptions-item label="平均负载">{{ deviceInfo.cpuload }}</a-descriptions-item>
        <a-descriptions-item label="git commit 号">{{ deviceInfo.git_sha }}</a-descriptions-item>
      </template>
    </a-descriptions>
    <br />
  </div>
</template>

<script>
import * as echarts from "echarts";
import store from "../../store";
import { mapActions, mapState, mapGetters } from "vuex";
const accountArr = {
  "1":"superadmin",
  "2":"senior",
  "3":"user"
}
export default {
  data() {
    return {
      memoryChart: null,
      accountArr
    };
  },
  computed:{
    deviceInfo: () => store.getters["sysStatus/deviceInfo"],
    account_level: () => store.getters["sysStatus/account_level"],
  },
  mounted() {
    store.dispatch("sysStatus/getDeviceInfo").then(() => {
      this.drawChart();
    });
    clearInterval(window.DeviceInfoInterval);
    window.DeviceInfoInterval = setInterval(() => {
      store.dispatch("sysStatus/getDeviceInfo");
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(window.DeviceInfoInterval);
  },
  methods: {
    drawChart() {
      const chartDom = document.getElementById("memory");
      this.memoryChart = echarts.init(chartDom);
      let option = {
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            data: [
              {
                value: this.deviceInfo.memory4,
                name: `已用内存:${this.deviceInfo.memory4} kB`,
              },
              {
                value: this.deviceInfo.memory2,
                name: `可用内存:${this.deviceInfo.memory2} kB`,
              },
              {
                value: this.deviceInfo.memory3,
                name: `内存缓存:${this.deviceInfo.memory3} kB`,
              },
            ],
          },
        ],
      };
      option && this.memoryChart.setOption(option);
    },
  },
};
</script>