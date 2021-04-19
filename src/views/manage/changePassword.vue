<template>
  <div>
    <headerInfo :labelText="$t('help.title19')" :spanText="$t('help.details19')" />
    <a-form-model
      style="margin-top: 20px"
      ref="Form"
      :model="Form"
      :rules="rules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 10 }"
    >
      <a-form-model-item :label="$t('manage.userType')" v-if="account_level == '1'">
        <a-select v-model="userType">
          <a-select-option value="3">{{$t('manage.userAcc')}}</a-select-option>
          <a-select-option value="2">{{$t('manage.adminAcc')}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :label="$t('manage.oldPass')" prop="old_passwd" v-else>
        <a-input-password v-model="Form.old_passwd" />
      </a-form-model-item>
      <a-form-model-item :label="$t('manage.newPass')" prop="newPasswd">
        <a-input-password v-model="Form.newPasswd" />
      </a-form-model-item>
      <a-form-model-item :label="$t('manage.confirmPass')" prop="confirm_passwd">
        <a-input-password v-model="Form.confirm_passwd" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 10, offset: 15 }">
        <a-button type="primary" @click="submitForm('Form')">{{$t("tips.ok")}}</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import store from "../../store";
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
export default {
  components: {
    headerInfo,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("tips.empty")));
      } else if (value !== this.Form.newPasswd) {
        callback(new Error(this.$t("tips.samePass")));
      } else {
        callback();
      }
    };
    return {
      userType: "3",
      Form: {
        newPasswd: "",
        old_passwd: "",
        confirm_passwd: "",
      },
      rules: {
        old_passwd: [{ validator: Validate.checkNull, trigger: "change" }],
        newPasswd: [{ validator: Validate.checkSysPass, trigger: "change" }],
        confirm_passwd: [{ validator: validatePass, trigger: "change" }],
      },
    };
  },
  computed: {
    account_level: () => store.getters["sysStatus/account_level"],
  },
  methods: {
    postData() {
      this.$loading_tool({ loading: true });
      let json = {};
      switch (this.account_level) {
        case "1":
          json = {
            setPasswd: this.Form.newPasswd,
            cmd: this.$CMD.CHANGE_PASSWD,
            tz_account: this.userType,
            subcmd: 2,
          };
          break;
        case "2":
          json = {
            setPasswd: this.Form.newPasswd,
            cmd: this.$CMD.CHANGE_PASSWD,
            subcmd: 1,
          };
          break;
        case "3":
          json = {
            newPasswd: this.Form.newPasswd,
            old_passwd: this.Form.old_passwd,
            cmd: this.$CMD.CHANGE_PASSWD,
            subcmd: 0,
          };
          break;
      }
      this.$axiosRequest_post(json).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.account_level != "1" && this.$router.push({ name: "Login" });
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
  },
};
</script>