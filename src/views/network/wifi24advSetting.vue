<template>
  <div>
    <headerInfo
      :labelText="$t('help.title6')"
      :spanText="$t('help.details6')"
    />
    <div class="content">
      <a-form-model
        ref="Form_adv"
        :model="Form_adv"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-item :label="$t('wifiSet.txPower')">
          <a-select v-model="Form_adv.txPower">
            <a-select-option
              v-for="(item, index) in txOption"
              :value="item.value"
              :key="index"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('wifiSet.countryCode')" v-if="account_level=='1'">
          <a-select v-model="Form_adv.countryCode">
            <a-select-option
              v-for="(item, index) in countryCodeOption"
              :value="item.value"
              :key="index"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('wifiSet.channel')">
          <a-select v-model="Form_adv.channel">
            <a-select-option
              v-for="(item, index) in channelOption"
              :value="item.value"
              :key="index"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('wifiSet.wifiWorkMode')">
          <a-select v-model="Form_adv.wifiWorkMode">
            <a-select-option
              v-for="(item, index) in wifiWorkMode"
              :value="item.value"
              :key="index"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('wifiSet.bandWidth')">
          <a-select v-model="Form_adv.bandWidth">
            <a-select-option
              v-for="(item, index) in bandWidthOption"
              :value="item.value"
              :key="index"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <div v-if="account_level=='1'">
          <a-form-model-item :label="$t('wifiSet.maxNum')" prop="maxNum">
            <a-input v-model.number="Form_adv.maxNum" :maxLength="32"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('wifiSet.connectNum')" prop="connectNum">
            <a-input v-model="Form_adv.connectNum" :maxLength="32"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('wifiSet.eliminateNum')" prop="eliminateNum">
            <a-input v-model="Form_adv.eliminateNum" :maxLength="32"/>
          </a-form-model-item>
        </div>
        <a-form-model-item label="WMM">
          <a-switch v-model="Form_adv.wifiwmm" />
        </a-form-model-item>
      </a-form-model>
      <div class="form-footer">
        <a-button type="primary" @click="submitForm('Form_adv')">{{
          $t("tips.ok")
        }}</a-button>
        <a-button style="margin-left: 20px" @click="resetForm('Form_adv')">{{
          $t("tips.cancel")
        }}</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../../store";
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
import {
  bandWidthOption_24,
  wifiWorkMode_24,
  txOption_24,
  channelOption_2g,
  countryCodeOption,
} from "./wifiSetOption.js";
const checkNum = (rule, value, callback) => {
  Validate.checkRange(value, [-99, 0], callback);
};
const checkNum1 = (rule, value, callback) => {
  Validate.checkRange(value, [1, 32], callback);
};
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      Form_adv: {
        txPower: "100", //发射功率
        channel: "auto", //信道
        wifiWorkMode: "6", //工作模式
        bandWidth: "0", //带宽
        maxNum: "32", //最大用户连接数
        countryCode: "CN", //国家码
        connectNum: "0", //接入阈值
        eliminateNum: "0", //剔除阈值
        wifiwmm: true, //WMM
      },
      //options
      bandWidthOption: bandWidthOption_24,
      wifiWorkMode: wifiWorkMode_24,
      txOption: txOption_24,
      countryCodeOption,
      rules: {
        maxNum: [{ validator: checkNum1 }],
        eliminateNum: [{ validator: checkNum }],
        connectNum: [{ validator: checkNum }],
      },
    };
  },
  computed:{
    channelOption(){
      return channelOption_2g[this.Form_adv.countryCode]
    },
    account_level: () => store.getters["sysStatus/account_level"],
  },
  watch:{
    channelOption(){
      this.Form_adv.channel = 'auto'
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let res_adv = await this.$axiosRequest_get({
        cmd: this.$CMD.WIRELESS_ADVANCE,
      });
      this.$refs["Form_adv"].resetFields();
      for (let key in this.Form_adv) {
        if (res_adv.hasOwnProperty(key)) {
          this.Form_adv[key] = res_adv[key];
        }
      }
      this.Form_adv.wifiwmm = this.Form_adv.wifiwmm === "1";
    },
    postData() {
      this.$loading_tool({ loading: true });
      let json = {
        txPower: this.Form_adv.txPower,
        channel: this.Form_adv.channel,
        wifiWorkMode: this.Form_adv.wifiWorkMode,
        bandWidth: this.Form_adv.bandWidth,
        maxNum: this.Form_adv.maxNum,
        countryCode:this.Form_adv.countryCode,
        eliminateNum: this.Form_adv.eliminateNum,
        connectNum: this.Form_adv.connectNum,
        wifiwmm: this.Form_adv.wifiwmm ? "1" : "0",
        cmd: this.$CMD.WIRELESS_ADVANCE,
      };
      this.$axiosRequest_post(json).then((res) => {
        this.$loading_tool({ loading: false });
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.getData();
    },
  },
};
</script>