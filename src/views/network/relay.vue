<template>
  <div id="content">
    <headerInfo
      :labelText="$t('help.title1')"
      :spanText="$t('help.details1')"
    />
    <a-empty :image-style="{ height: '100px' }" v-if="meshOpen || wifiAllClose">
      <span slot="description"> {{ wifiAllClose?$t("relay.wifiAllClose"):$t("relay.tips") }} </span>
      <a-button type="primary" @click="$router.push({name:'Wifi24g'})" v-if="wifiAllClose">{{ $t("relay.openWifi") }}</a-button>
      <a-button type="primary" @click="closeMesh" v-else>{{ $t("relay.closeMesh") }}</a-button>
    </a-empty>
    <a-spin
      v-else
      :spinning="loading"
      :tip="$t('relay.scanning')"
      :indicator="indicator"
    >
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="{ pageSize: 999 }"
        :scroll="{ y: 350 }"
        class="relay-table"
      >
        <template slot="select" slot-scope="text, record">
          <a-tag
            color="cyan"
            class="add-tag"
            style="borderstyle: dashed"
            @click="selectWifi(record)"
          >
            <a-icon type="plus" />
          </a-tag>
        </template>
        <template slot="signal" slot-scope="text, record">
          <div
            class="relay-signal"
            :style="{ 'background-image':  'url(' + require('../../assets/images/signal_icon/signal-'+text+'.png') + ')'}"
            v-show="record.encryType == '0'"
          ></div>
          <div
            class="relay-signal"
            :style="{ 'background-image':  'url(' + require('../../assets/images/signal_icon/signal-lock-'+text+'.png') + ')'}"
            v-show="record.encryType != '0'"
          ></div>
        </template>
        <template slot="encryType" slot-scope="text">
          <div>{{ authentication[text] }}</div>
        </template>
        <template slot="title">
          <div class="relay-title">
            <div>
              {{ $t("relay.selectWifi") }}
              <a-radio-group v-model="wifi_type">
                <a-tooltip placement="left">
                  <template slot="title" v-if="!wifiOpen_24">
                    <span>2.4GWi-Fi已关闭</span>
                  </template>
                  <a-radio value="2G" :disabled="!wifiOpen_24">2.4G</a-radio>
                </a-tooltip>
                <a-tooltip placement="right">
                  <template slot="title" v-if="!wifiOpen_5">
                    <span>5GWi-Fi已关闭</span>
                  </template>
                  <a-radio value="5G" :disabled="!wifiOpen_5">5G</a-radio>
                </a-tooltip>
              </a-radio-group>
            </div>
            <!-- <div>
              {{ $t("relay.needSync") }}
              <a-switch v-model="needSync" />
            </div> -->
            <a-button size="small" type="primary" @click="getData">{{
              $t("relay.scann")
            }}</a-button>
          </div>
        </template>
        <template slot="footer">
          <div class="relay-footer">
            {{ $t("relay.relayNetwork") }}
            <a>{{ currentData.ssid || "无" }}</a>
            {{ $t("relay.password") }}
            <a>{{ currentData.encryKey || "无" }}</a>
            {{ $t("relay.status") }}
            <a>{{ currentData.status == "1" ? "已连接" : "未连接" }}</a>
          </div>
        </template>
      </a-table>
    </a-spin>
    <!-- 弹窗 -->
    <a-modal
      centered
      v-model="passwordModal"
      :title="$t('relay.inputWifipwd')"
      :okText="$t('tips.ok')"
      :cancelText="$t('tips.cancel')"
      @ok="clickRelay"
      @cancel="clearForm"
      :closable="false"
      :maskClosable="false"
    >
      <a-form-model
        ref="Form"
        :model="Form"
        :rules="{
          password: [{ validator: Validate.WifiPwd }],
        }"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item :label="$t('relay.wifiPwd')" prop="password">
          <a-input-password v-model="Form.password" :maxLength="50"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { i18n } from "../../i18n";
import store from "../../store";
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
const columns = [
  {
    title: i18n.t("relay.select"),
    dataIndex: "select",
    width: 65,
    className: 'column-center-th column-center-td',
    scopedSlots: { customRender: "select" },
  },
  {
    title: i18n.t("relay.ssid"),
    dataIndex: "ssid",
    ellipsis: true,
  },
  {
    title: i18n.t("relay.chanel"),
    dataIndex: "chanel",
    width: 120,
    className: 'column-center-th column-center-td',
  },
  {
    title: i18n.t("relay.authmode"),
    dataIndex: "encryType",
    width: 230,
    scopedSlots: { customRender: "encryType" },
  },
  {
    title: i18n.t("relay.signal"),
    dataIndex: "signal",
    width: 65,
    className: "columns-signal column-center-th column-center-td",
    scopedSlots: { customRender: "signal" },
  },
];
const authentication = {
  "0":"OPEN",
  "1":"WPA-PSK",
  "2":"WPA2-PSK",
  "3":"WPA/WPA2-PSK",
  "4":"WPA3-PSK",
  "5":"WPA2/WPA3-PSK",
} 
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      indicator: (
        <a-icon type="loading-3-quarters" style="font-size: 24px" spin />
      ),
      loading: false,
      data: [],
      tmpWifiInfo: {},
      columns,
      wifi_type: "2G",
      // needSync: false,
      Form: {
        password: "",
      },
      passwordModal: false,
      Validate,
      currentData: {},
      authentication,
    };
  },
  computed: {
    meshOpen: () => store.getters["sysStatus/meshOpen"],
    wifiOpen_24: () => store.getters["sysStatus/wifiOpen_24"],
    wifiOpen_5: () => store.getters["sysStatus/wifiOpen_5"],
    wifiAllClose(){
      return !this.wifiOpen_24 && !this.wifiOpen_5
    },
  },
  async mounted() {
    await store.dispatch("sysStatus/getWifiInfo")
    if(this.wifiOpen_24 || this.wifiOpen_5){
      this.wifi_type = this.wifiOpen_24 ? "2G" : "5G"
      // this.getData();
    }else{
      this.wifi_type = "2G"
    }
    this.getRelayStatus();
  },
  beforeDestroy() {
    clearInterval(window.getRelayStatus)
  },
  methods: {
    async getRelayStatus() {
      let res = await this.$axiosRequest_post({ cmd: this.$CMD.RELAY_SETTING });
      this.currentData = res || {};
    },
    async getStatus() {
      let json = {
        cmd:
          this.wifi_type == "2G"
            ? this.$CMD.RELAYSET_4G
            : this.$CMD.RELAYSET_5G,
      };
      this.$axiosRequest_get(json).then((res) => {
        console.log(res.success_flag, "success_flag");
        if (res.success_flag == "1") {
          clearInterval(window.getRelayStatus)
          this.$loading_tool({ loading: false });
          store.dispatch("sysStatus/getNetworkInfo"); //更新vuex
          this.$message.success("中继成功");
          this.getRelayStatus();
        } else {
          this.index++
        }
        if(this.index > 20){
          this.$message.error("中继超时失败");
          this.$loading_tool({ loading: false });
          this.getRelayStatus();
          clearInterval(window.getRelayStatus)
        }
      });
    },
    async getData() {
      if (this.meshOpen) return;
      this.loading = true;
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.RELAY_SETTING,
        wifi_type: this.wifi_type,
      });
      if("dataList" in res){
        for (let i = 0; i < res.dataList.length; i++) {
          res.dataList[i].key = i;
        }
        this.data = res.dataList;
      }
      this.loading = false;
    },
    selectWifi(e) {
      if (e.encryType != "0") {
        this.passwordModal = true;
        this.tmpWifiInfo = e;
        return;
      }
      this.relayWifi(e);
    },
    async relayWifi(e) {
      this.$loading_tool({
        loading: true,
        text: "正在中继网络，请勿做其他操作",
      });
      let json = {
        ssid: e.ssid,
        encryKey: this.Form.password,
        encryType:e.encryType,
        cmd:
          this.wifi_type == "2G"
            ? this.$CMD.RELAYSET_4G
            : this.$CMD.RELAYSET_5G,
      };
      // if(this.wifi_type == "2G"){
      //   json.needSync = this.needSync ? "1" : "0"
      // }else{
      //   json.needSync = this.needSync ? "3" : "2"
      // }
      try {
        await this.$axiosRequest_post(json);
      } catch (error) {}
      this.index = 0
      clearInterval(window.getRelayStatus)
      window.getRelayStatus = setInterval(()=>{
        this.getStatus();
      },3000)
    },
    clickRelay() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.passwordModal = false;
          this.tmpWifiInfo.password = this.Form.password;
          this.relayWifi(this.tmpWifiInfo);
        } else {
          return false;
        }
      });
    },
    clearForm() {
      this.$refs.Form.resetFields();
    },
    closeMesh() {
      this.$loading_tool({ loading: true, text: this.$t("tips.closeMesh") });
      this.$axiosRequest_post({
        mesh_switch: "0",
        cmd: this.$CMD.MESH_SETTING,
        networking: "0",
      }).then((res) => {
        if (res.success) {
          setTimeout(() => {
            store.dispatch("sysStatus/getMeshStatus").then(() => {
              this.$loading_tool({ loading: false });
              this.$message.success(this.$t("tips.setSuccess"));
              // this.getData();
            });
          }, 8000);
        } else {
          this.$message.error(this.$t("tips.setFail"));
          this.$loading_tool({ loading: false });
        }
      });
    },
  },
};
</script>
<style lang="less">
.relay-table{
  .ant-table-pagination.ant-pagination{
    display: none !important;
  };
  .ant-table.ant-table-bordered .ant-table-footer,
  .ant-table.ant-table-bordered .ant-table-title{
    padding: 10px;
  }
}
</style>