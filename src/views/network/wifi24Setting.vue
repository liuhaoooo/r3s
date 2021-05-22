<template>
  <div>
    <headerInfo
      :labelText="$t('help.title5')"
      :spanText="$t('help.details5')"
    />
    <div class="tab_wifi" v-if="account_level=='1'">
      <a-radio-group
        default-value="0"
        button-style="solid"
        @change="wifiChange"
      >
        <a-radio-button value="0"> {{$t("wifiSet.main_wifi")}} </a-radio-button>
        <a-radio-button value="1"> {{$t("wifiSet.vice_wifi")}}1 </a-radio-button>
        <a-radio-button value="2"> {{$t("wifiSet.vice_wifi")}}2 </a-radio-button>
        <a-radio-button value="3"> {{$t("wifiSet.vice_wifi")}}3 </a-radio-button>
      </a-radio-group>
    </div>
    <div class="content">
      <a-form-model
        ref="Form"
        :model="Form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-model-item :label="$t('wifiSet.wifiEnable')">
          <a-switch v-model="Form.wifiOpen" @change="wifiOpenChange"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('wifiSet.wifiName')" prop="ssid">
          <a-input
            :maxLength="32"
            :disabled="!Form.wifiOpen"
            v-model="Form.ssid"
            style="width: 60%; margin-right: 10px"
          />
          <a-checkbox
            @change="(e) => (this.Form.broadcast = e.target.checked)"
            :checked="Form.broadcast"
            :disabled="!Form.wifiOpen"
          >
            {{$t('wifiSet.wifiBroadcast')}}
          </a-checkbox>
        </a-form-model-item>
        <a-form-model-item :label="$t('wifiSet.authenticationType')">
          <a-select
            v-model="Form.authenticationType"
            :disabled="!Form.wifiOpen"
          >
            <a-select-option
              v-for="(item, index) in authenticationOption"
              :key="index"
              :value="item.value"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <div v-if="Form.authenticationType != '0'">
          <a-form-model-item :label="$t('wifiSet.password')" prop="key">
            <a-input-password v-model="Form.key" :disabled="!Form.wifiOpen" :maxLength="32"/>
          </a-form-model-item>
        </div>
      </a-form-model>
      <div class="form-footer">
        <a-tooltip placement="left">
          <template slot="title" v-if="is5G">
            <span>5G优选已开启</span>
          </template>
          <a-button type="primary" @click="submitForm('Form')" :disabled="is5G">{{
          $t("tips.ok")
        }}</a-button>
        </a-tooltip>
        <a-button style="margin-left: 20px" @click="getData">{{
          $t("tips.cancel")
        }}</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../../store";
import { Base64 } from "js-base64";
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
import { authenticationOption } from "./wifiSetOption.js";
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      subcmd: 0,
      Form: {
        wifiOpen: true, //Wi-Fi开关
        ssid: "", //Wi-Fi名称
        broadcast: false, //隐藏Wi-Fi
        authenticationType: "2", //加密方式
        key: "", //wifi密码
      },
      //options
      authenticationOption,
      //rules
      rules: {
        ssid: [{ validator: Validate.Ssid }],
        key: [{ validator: Validate.WifiPwd }],
      },
    };
  },
  computed:{
    is5G: () => store.getters["sysStatus/is5G"],
    account_level: () => store.getters["sysStatus/account_level"],
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.WIRELESS_CONFIG,
        subcmd: this.subcmd,
      });
      this.$refs["Form"].resetFields();
      for (let key in this.Form) {
        if (res.hasOwnProperty(key)) {
          this.Form[key] = res[key];
        }
      }
      this.Form.ssid = Base64.decode(this.Form.ssid);
      this.Form.wifiOpen = this.Form.wifiOpen === "1";
      this.Form.broadcast = this.Form.broadcast === "1";
    },
    postData() {
      this.$loading_tool({ loading: true });
      let json = {
        wifiOpen: this.Form.wifiOpen ? "1" : "0",
        ssid: Base64.encode(this.Form.ssid),
        key: this.Form.key,
        broadcast: this.Form.broadcast ? "1" : "0",
        authenticationType: this.Form.authenticationType,
        cmd: this.$CMD.WIRELESS_CONFIG,
        subcmd: this.subcmd,
      };
      this.$axiosRequest_post(json).then((res) => {
        this.$loading_tool({ loading: false });
        store.dispatch("sysStatus/getWifiInfo"); //更新vuex wifi信息
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    hideChange(e) {
      this.Form.broadcast = e.target.checked;
    },
    wifiChange(e) {
      this.subcmd = Number(e.target.value);
      this.getData();
    },
    wifiOpenChange(e){
      !e && this.$refs['Form'].clearValidate()
    },
    submitForm(formName) {
      if (!this.Form.wifiOpen) {
        this.postData();
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      });
    },
  },
};
</script>