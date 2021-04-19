<template>
  <div>
    <headerInfo
      :labelText="$t('help.title1')"
      :spanText="$t('help.details1')"
    />
    <a-empty :image-style="{ height: '100px' }" v-if="meshOpen">
      <span slot="description"> {{ $t("relay.tips") }} </span>
      <a-button type="primary" @click="closeMesh">
        {{ $t("relay.closeMesh") }}
      </a-button>
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
        :pagination="{ pageSize: 5 }"
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
            :class="'relay-signal relay-signal-img-' + text"
            v-if="record.authmode == 'OPEN/NONE'"
          ></div>
          <div
            :class="'relay-signal relay-signal-img-lock-' + text"
            v-else
          ></div>
        </template>
        <template slot="authmode" slot-scope="text">
          <div>{{ text.split("/")[0] }}</div>
        </template>
        <template slot="title">
          <div class="relay-title">
            <div>
              {{ $t("relay.selectWifi") }}
              <a-radio-group v-model="wifi_type">
                <a-radio value="2G">2.4G</a-radio>
                <a-radio value="5G">5G</a-radio>
              </a-radio-group>
            </div>
            <div>
              {{ $t("relay.needSync") }}
              <a-switch v-model="needSync" />
            </div>
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
            <a>{{ currentData.passwd || "无" }}</a>
            {{ $t("relay.status") }}
            <a>{{ currentData.success_flag == "1" ? "已连接" : "未连接" }}</a>
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
          password: [{ validator: Validate.WifiPwd, trigger: 'change' }],
        }"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item :label="$t('relay.wifiPwd')" prop="password">
          <a-input-password v-model="Form.password" />
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
    dataIndex: "authmode",
    width: 230,
    scopedSlots: { customRender: "authmode" },
  },
  {
    title: i18n.t("relay.signal"),
    dataIndex: "signal",
    width: 65,
    className: "columns-signal column-center-th column-center-td",
    scopedSlots: { customRender: "signal" },
  },
];
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
      needSync: false,
      Form: {
        password: "",
      },
      passwordModal: false,
      Validate,
      currentData: {},
    };
  },
  computed: {
    meshOpen: () => store.getters["sysStatus/meshOpen"],
  },
  mounted() {
    this.getData();
    this.getRelayStatus();
  },
  methods: {
    async getRelayStatus() {
      let res = await this.$axiosRequest_get({ cmd: this.$CMD.RELAY_SETTING });
      console.log(res, "中继信息");
      this.currentData = res;
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
        if (this.index > 20) {
          this.$loading_tool({ loading: false });
          this.$message.error("中继超时失败");
          return;
        }
        if (res.success_flag == "1") {
          store.dispatch("sysStatus/getNetworkInfo_post"); //更新vuex
          this.getRelayStatus();
          this.$loading_tool({ loading: false });
          this.$message.success("中继成功");
        } else {
          setTimeout(() => {
            this.getStatus();
            this.index++;
          }, 3000);
        }
      });
    },
    async getData() {
      if (this.meshOpen) return;
      this.loading = true;
      let res = await this.$axiosRequest_post({
        cmd: this.$CMD.RELAY_SETTING,
        wifi_type: this.wifi_type,
      });
      for (let i = 0; i < res.dataList.length; i++) {
        res.dataList[i].key = i;
      }
      this.data = res.dataList;
      this.loading = false;
    },
    selectWifi(e) {
      if (e.authmode != "OPEN/NONE") {
        this.passwordModal = true;
        this.tmpWifiInfo = e;
        return;
      }
      this.relayWifi(e);
    },
    relayWifi(e) {
      this.$loading_tool({
        loading: true,
        text: "正在中继网络，请勿做其他操作",
      });
      let json = {
        ssid: e.ssid,
        needSync: this.needSync ? "1" : "0",
        wpa_encryKey: this.Form.password,
        encryType: e.authmode.split("/")[0],
        wpa_encry: e.authmode.split("/")[1],
        cmd:
          this.wifi_type == "2G"
            ? this.$CMD.RELAYSET_4G
            : this.$CMD.RELAYSET_5G,
      };
      this.$axiosRequest_post(json).then((res) => {
        if (res.success) {
          this.index = 0;
          this.getStatus();
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
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
              this.getData();
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
.relay-signal-img-1 {
  background-image: url("../../assets/images/signal_icon/signal-1.png");
}
.relay-signal-img-2 {
  background-image: url("../../assets/images/signal_icon/signal-2.png");
}
.relay-signal-img-3 {
  background-image: url("../../assets/images/signal_icon/signal-3.png");
}
.relay-signal-img-4 {
  background-image: url("../../assets/images/signal_icon/signal-4.png");
}
.relay-signal-img-5 {
  background-image: url("../../assets/images/signal_icon/signal-5.png");
}
.relay-signal-img-lock-1 {
  background-image: url("../../assets/images/signal_icon/signal-lock-1.png");
}
.relay-signal-img-lock-2 {
  background-image: url("../../assets/images/signal_icon/signal-lock-2.png");
}
.relay-signal-img-lock-3 {
  background-image: url("../../assets/images/signal_icon/signal-lock-3.png");
}
.relay-signal-img-lock-4 {
  background-image: url("../../assets/images/signal_icon/signal-lock-4.png");
}
.relay-signal-img-lock-5 {
  background-image: url("../../assets/images/signal_icon/signal-lock-5.png");
}
</style>