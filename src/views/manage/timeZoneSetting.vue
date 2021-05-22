<template>
  <div>
    <headerInfo
      :labelText="$t('help.title25')"
      :spanText="$t('help.details25')"
    />
    <div class="content">
      <a-form-model
        ref="Form"
        :model="Form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-model-item :label="'当前系统时间'" class="sysTime">
          <span style="font-size: 1.3rem" class="mytext-color">{{
            systime
          }}</span>
          <a-button
            size="small"
            type="primary"
            style="margin-left: 20px"
            @click="syncClientTime"
            >{{ "同步客户端时间" }}</a-button
          >
        </a-form-model-item>
        <a-form-item :label="'时区'">
          <a-select v-model="Form.timezone">
            <a-select-option
              v-for="(item, index) in timeZoneOptions"
              :value="item.value"
              :key="index"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-model-item :label="'NTP1'" prop="timeServer">
          <a-input v-model="Form.timeServer" :maxLength="50" />
        </a-form-model-item>
        <a-form-model-item :label="'NTP2'" prop="timeServer2">
          <a-input v-model="Form.timeServer2" :maxLength="50" />
        </a-form-model-item>
        <a-form-model-item :label="'NTP3'" prop="timeServer3">
          <a-input v-model="Form.timeServer3" :maxLength="50" />
        </a-form-model-item>
        <a-form-model-item :label="'NTP4'" prop="timeServer4">
          <a-input v-model="Form.timeServer4" :maxLength="50" />
        </a-form-model-item>
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
import moment from "moment";
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
import { timeZoneOptions } from "./timeZone.js";
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      timeZoneOptions,
      systime: "",
      Form: {
        timezone: "UTC-8",
        timeServer: "",
        timeServer2: "",
        timeServer3: "",
        timeServer4: "",
      },
      rules: {
        timeServer: [{ validator: Validate.checkNull }],
        // timeServer2: [{ validator: Validate.checkNull }],
        // timeServer3: [{ validator: Validate.checkNull }],
        // timeServer4: [{ validator: Validate.checkNull }],
      },
    };
  },
  mounted() {
    clearInterval(window.addTimeInterval);
    this.getData();
  },
  beforeDestroy() {
    clearInterval(window.addTimeInterval);
  },
  methods: {
    addTime(systime) {
      let i = 0;
      window.addTimeInterval = setInterval(() => {
        this.systime = moment(systime, "YYYY-MM-DD HH:mm:ss")
          .add(++i, "s")
          .format("YYYY-MM-DD HH:mm:ss");
      }, 1000);
    },
    async getData() {
      clearInterval(window.addTimeInterval);
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.SET_DATETIME,
      });
      console.log(res);
      this.$refs["Form"].resetFields();
      for (let key in this.Form) {
        if (res.hasOwnProperty(key)) {
          this.Form[key] = res[key];
        }
      }
      this.Form.timezone = this.Form.timezone || "UTC-8";
      this.systime = moment(res.systime, "YYYY-MM-DD HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.addTime(res.systime);
    },
    postData() {
      this.$loading_tool({ loading: true });
      let json = {
        timeServer: this.Form.timeServer,
        timeServer2: this.Form.timeServer2,
        timeServer3: this.Form.timeServer3,
        timeServer4: this.Form.timeServer4,
        timezone: this.Form.timezone,
        cmd: this.$CMD.SET_DATETIME,
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      });
    },
    syncClientTime() {
      let clientTime = moment().format("YYYY-MM-DD HH:mm:ss");
      this.$axiosRequest_post({
        cmd: this.$CMD.SYNC_CLIENT_TIME,
        clientTime,
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
  },
};
</script>
<style lang="less">
.sysTime {
  .ant-form-item-control {
    line-height: 35px !important;
  }
}
</style>