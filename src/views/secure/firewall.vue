<template>
  <div>
    <headerInfo
      :labelText="$t('help.title12')"
      :spanText="$t('help.details12')"
    />
    <div class="content">
      <a-form-model
        ref="Form"
        :model="Form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-model-item label="攻击保护设置">
          <a-switch v-model="Form.protect_enable"/>
        </a-form-model-item>
        <a-form-model-item label="防火墙等级配置">
          <a-select
            v-model="Form.level"
            style="width: 200px; margin-right: 10px"
            :disabled="!Form.protect_enable"
          >
            <a-select-option value="0">低级</a-select-option>
            <a-select-option value="1">中级</a-select-option>
            <a-select-option value="2">高级</a-select-option>
          </a-select>
          <a-button type="primary" @click="postData_level">{{
            $t("tips.ok")
          }}</a-button>
        </a-form-model-item>
        <a-divider>DMZ</a-divider>
        <div v-show="!isBradge_Relay">
          <a-form-model-item :label="$t('firewall.dmzEnable')">
            <a-switch v-model="Form.enabled" @change="dmzChange"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('firewall.ip')" prop="ip">
            <a-input
              v-model="Form.ip"
              :maxLength="50"
              :disabled="!Form.enabled"
              style="width: 200px; margin-right: 10px"
            />
            <a-button type="primary" @click="submitForm('Form')">{{
              $t("tips.ok")
            }}</a-button>
          </a-form-model-item>
        </div>
        <!-- 桥接中继模式 -->
        <emptyBradgeRelay />
      </a-form-model>
    </div>
  </div>
</template>

<script>
import store from "../../store";
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
import emptyBradgeRelay from "../../components/empty_BradgeRelay.vue";
export default {
  components: {
    headerInfo,
    emptyBradgeRelay,
  },
  computed: {
    isBradge_Relay: () => store.getters["sysStatus/isBradge_Relay"],
  },
  data() {
    return {
      Form: {
        level: "1",
        protect_enable: true,
        ip: "",
        enabled: true,
      },
      rules: {
        ip: [{ validator: Validate.checkIP }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      //等级+攻击保护设置
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.SECURITY_LEVEL,
      });
      this.Form.level = res.level || "0";
      this.Form.protect_enable = res.protect_enable == "1";
      //攻击保护设置
      // let res_protect = await this.$axiosRequest_get({
      //   cmd: this.$CMD.PROTECTED_SETTING,
      // });
      // this.Form.protect_enable = res_protect.protect_enable == "1";
      //dmz
      let res_dmz = await this.$axiosRequest_get({
        cmd: this.$CMD.NETWORK_SERVICE,
        subcmd: 6,
      });
      this.Form.enabled = res_dmz.enabled == "1";
      this.Form.ip = res_dmz.ip;
    },
    //dmz
    postData_dmz() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post({
        enabled: this.Form.enabled ? "1" : "0",
        ip: this.Form.ip,
        cmd: this.$CMD.NETWORK_SERVICE,
        subcmd: 6,
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    submitForm(formName) {
      if (!this.Form.enabled) {
        this.postData_dmz();
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postData_dmz();
        } else {
          return false;
        }
      });
    },
    dmzChange(e){
      !e && this.$refs['Form'].clearValidate()
    },
    //等级+攻击保护设置
    postData_level() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post({
        level: this.Form.level,
        protect_enable: this.Form.protect_enable ? "1" : "0",
        cmd: this.$CMD.SECURITY_LEVEL,
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    //攻击保护设置
    // protect_enableChange(e) {
    //   this.$loading_tool({ loading: true });
    //   this.$axiosRequest_post({
    //     protect_enable: e ? "1" : "0",
    //     cmd: this.$CMD.PROTECTED_SETTING,
    //   }).then((res) => {
    //     this.$loading_tool({ loading: false });
    //     if (res.success) {
    //       this.$message.success(this.$t("tips.setSuccess"));
    //     } else {
    //       this.$message.error(this.$t("tips.setFail"));
    //     }
    //   });
    // },
  },
};
</script>