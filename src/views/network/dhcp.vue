<template>
  <div>
    <headerInfo
      :labelText="$t('help.title2')"
      :spanText="$t('help.details2')"
    />
    <div class="content">
      <a-form-model
        ref="Form"
        :model="Form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-model-item :label="$t('dhcp.lanip')" prop="lanIp">
          <a-input v-model="Form.lanIp" @change="inputChange" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('dhcp.netMask')" prop="netMask">
          <a-input v-model="Form.netMask" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('dhcp.dhcpServer')">
          <a-switch v-model="Form.dhcpServer" />
        </a-form-model-item>
        <div v-if="Form.dhcpServer">
          <a-form-model-item :label="$t('dhcp.main_dns')" prop="main_dns">
            <a-input v-model="Form.main_dns" :maxLength="50"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('dhcp.vice_dns')" prop="vice_dns">
            <a-input v-model="Form.vice_dns" :maxLength="50"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('dhcp.ipBeginEnd')" prop="ipBegin">
            <a-input v-model="Form.ipBegin" style="width: 156px" :maxLength="50"/>
            <span> --- </span>
            <a-input v-model="Form.ipEnd" style="width: 156px" :maxLength="50" @change="ipEndChange"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('dhcp.expireTime')">
            <a-select v-model="Form.expireTime">
              <a-select-option
                v-for="(item, index) in expireTimeOption"
                :key="index"
                :value="item.value"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </div>
      </a-form-model>
      <div class="form-footer">
        <a-button type="primary" @click="submitForm('Form')">{{
          $t("tips.ok")
        }}</a-button>
        <a-button style="margin-left: 20px" @click="getData">{{
          $t("tips.cancel")
        }}</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
const expireTimeOption = [
  { name: "10小时", value: "10h" },
  { name: "1天", value: "24h" },
  { name: "1周", value: "168h" },
];
const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
export default {
  components: {
    headerInfo,
  },
  data() {
    //地址池校验
    const checkIpBeginEnd = (rule, value, callback) => {
      console.log(this.Form.ipBegin)
      if (this.Form.ipBegin === "" || this.Form.ipEnd === "") {
        return callback(new Error(this.$t('tips.empty')));
      } else if (!reg.test(this.Form.ipBegin) || !reg.test(this.Form.ipEnd)) {
        return callback(new Error(this.$t('tips.formatError')));
      }
      let lanIPArr = this.Form.lanIp.split("."),
        ipBeginIPArr = this.Form.ipBegin.split("."),
        ipEndArr = this.Form.ipEnd.split("."),
        addr2 = value.split("."),
        mask = this.Form.netMask.split("."),
        newLanIP = Number(lanIPArr[3]),
        newIpBegin = Number(ipBeginIPArr[3]),
        newIpEnd = Number(ipEndArr[3]),
        res1 = [],
        res2 = [];
      for (let i = 0, ilen = lanIPArr.length; i < ilen; i++) {
        res1.push(parseInt(lanIPArr[i]) & parseInt(mask[i]));
        res2.push(parseInt(addr2[i]) & parseInt(mask[i]));
      }
      if (
        newIpBegin >= newIpEnd ||
        (newLanIP >= newIpBegin && newLanIP <= newIpEnd) ||
        res1.join(".") != res2.join(".")
      ) {
        callback(new Error(this.$t('tips.rangeError')));
      } else {
        callback();
      }
    };
    return {
      Form: {
        dhcpServer: true,
        expireTime: "24h",
        ipBegin: "",
        ipEnd: "",
        lanIp: "",
        main_dns: "",
        vice_dns: "",
        netMask: "",
      },
      //options
      expireTimeOption,
      //rules
      rules: {
        lanIp: [{ validator: Validate.checkIP }],
        netMask: [{ validator: Validate.checkNetMask }],
        main_dns: [{ validator: Validate.checkIP }],
        vice_dns: [{ validator: Validate.checkIP }],
        ipBegin: [{ validator: checkIpBeginEnd }],
        ipEnd: [{ validator: checkIpBeginEnd }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //lanip输入自动填充ip地址池
    inputChange() {
      if(this.Form.ipBegin !== ''){//同时触发校验
        this.$refs.Form.validate();
      }
      if (reg.test(this.Form.lanIp)) {
        this.Form.ipBegin = this.lanIpChange(this.Form.ipBegin);
        this.Form.ipEnd = this.lanIpChange(this.Form.ipEnd);
        if (!this.Form.main_dns) {
          this.Form.main_dns = this.Form.lanIp;
        }
      }
    },
    lanIpChange(value) {
      let newIp = value.split("."),
        i = 0;
      while (i < 3) {
        this.$set(newIp, i, this.Form.lanIp.split(".")[i]);
        i++;
      }
      return newIp.join(".");
    },
    ipEndChange(){
      if(this.Form.ipBegin !== ''){//同时触发校验
        this.$refs.Form.validate();
      }
    },
    async getData() {
      let res = await this.$axiosRequest_get({ cmd: this.$CMD.NETWORK_CONFIG });
      this.$refs["Form"].resetFields();
      for (let key in this.Form) {
        if (res.hasOwnProperty(key)) {
          this.Form[key] = res[key];
        }
      }
      this.Form.dhcpServer = this.Form.dhcpServer === "1";
    },
    postData() {
      this.$loading_tool({ loading: true });
      let json = {
        lanIp: this.Form.lanIp,
        netMask: this.Form.netMask,
        dhcpServer: this.Form.dhcpServer ? "1" : "0",
        cmd: this.$CMD.NETWORK_CONFIG,
      };
      if (this.Form.dhcpServer) {
        json.main_dns = this.Form.main_dns;
        json.vice_dns = this.Form.vice_dns;
        json.ipBegin = this.Form.ipBegin;
        json.ipEnd = this.Form.ipEnd;
        json.expireTime = this.Form.expireTime;
      }
      this.$axiosRequest_post(json).then((res) => {
        if (res.success) {
          this.$loading_tool({ loading: false });
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$loading_tool({ loading: false });
          this.$message.error(this.$t("tips.setFail"));
        }
      });
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
  },
};
</script>