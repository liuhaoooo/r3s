<template>
  <div>
    <headerInfo
      :labelText="$t('help.title9')"
      :spanText="$t('help.details9')"
    />
    <div class="tab_wpsSet">
      <a-radio-group
        :default-value="0"
        button-style="solid"
        v-model="typeRadio"
        @change="typeChange"
      >
        <a-radio-button :value="0" class="tab_item">
          {{ $t("wpsSetting.wps24g") }}
        </a-radio-button>
        <a-radio-button :value="1" class="tab_item">
          {{ $t("wpsSetting.wps5g") }}
        </a-radio-button>
      </a-radio-group>
    </div>
    <br />
    <div class="content">
      <a-form-model
        ref="Form"
        :model="Form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-model-item :label="$t('wpsSetting.enable')">
          <a-switch v-model="Form.wpsEnable" @change="wpsEnableChange" />
        </a-form-model-item>
        <a-form-model-item :label="$t('wpsSetting.mode')">
          <a-radio-group
            v-model="Form.wpsType"
            :disabled="!Form.wpsEnable"
            @change="wpsTypeChange"
          >
            <a-radio value="pbc">{{$t('wpsSetting.auto')}}</a-radio>
            <a-radio value="pin">{{$t('wpsSetting.pin')}}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="WPS PIN" prop="wpsPin">
          <a-input
            :disabled="!Form.wpsEnable || Form.wpsType == 'pbc'"
            v-model="Form.wpsPin"
            style="width: 60%; margin-right: 10px"
          />{{$t('wpsSetting.len8')}}
        </a-form-model-item>
      </a-form-model>
      <div class="form-footer">
        <a-button
          type="primary"
          @click="submitForm('Form')"
          :disabled="!Form.wpsEnable"
          >{{$t('wpsSetting.startSet')}}</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
const wpsPin = (rule, value, callback) => {
  Validate.checkLen(value, [8, 8], callback);
  Validate.wpsPinCheck(value, callback);
};
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      typeRadio: 0,
      Form: {
        wpsEnable: true,
        wpsType: "pbc",
        wpsPin: "",
      },
      rules: {
        wpsPin: [{ validator: wpsPin, trigger: "change" }],
      },
    };
  },
  mounted() {
    this.getData(0);
  },
  methods: {
    async getData(subcmd) {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.WPS_CONFIG,
        subcmd,
      });
      if (subcmd == 0) {
        this.Form.wpsEnable = res.wlan2g_wps_switch == "7";
      } else {
        this.Form.wpsEnable = res.wlan5g_wps_switch == "7";
      }
    },
    //开始配置Pbc
    postDataPbc() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post({
        subcmd: this.typeRadio == 0 ? 2 : 3,
        cmd: this.$CMD.WPS_PIN_CODE,
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    //开始配置Pin
    postDataPin() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post({
        wpsPin:this.Form.wpsPin,
        subcmd: this.typeRadio == 0 ? 0 : 1,
        cmd: this.$CMD.WPS_PIN_CODE,
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    typeChange(e) {
      this.getData(e.target.value);
    },
    wpsTypeChange(e) {
      if (e.target.value == "pbc") {
        this.$refs["Form"].resetFields();
      }
    },
    wpsEnableChange(e) {
      this.$loading_tool({ loading: true });
      let json = {
        subcmd: this.typeRadio,
        cmd: this.$CMD.WPS_CONFIG,
      };
      if (this.typeRadio == 0) {
        json.wlan2g_wps_switch = e ? "7" : "0";
      } else {
        json.wlan5g_wps_switch = e ? "7" : "0";
      }
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
      if (!this.Form.wpsEnable || this.Form.wpsType == "pbc") {
        this.postDataPbc();
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postDataPin();
        } else {
          return false;
        }
      });
    },
  },
};
</script>