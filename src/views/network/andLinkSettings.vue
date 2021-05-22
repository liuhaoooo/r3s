<template>
  <div>
    <headerInfo
      :labelText="$t('help.title11')"
      :spanText="$t('help.details11')"
    />
    <div class="content">
      <a-form-model
        ref="Form"
        :model="Form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-model-item :label="$t('andlink.enable')">
          <a-switch v-model="Form.radio" @change="switchChange" />
        </a-form-model-item>
        <a-form-model-item :label="$t('andlink.if6')" prop="IF6url">
          <a-input v-model="Form.IF6url" :disabled="!Form.radio" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('andlink.if5')" prop="IF5url">
          <a-input v-model="Form.IF5url" :disabled="!Form.radio" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('andlink.ifa')" prop="IFAurl">
          <a-input v-model="Form.IFAurl" :disabled="!Form.radio" :maxLength="50"/>
        </a-form-model-item>
        <a-form-item :label="$t('andlink.province')">
          <a-select v-model="Form.province" :disabled="!Form.radio">
            <a-select-option
              v-for="(item, index) in provinceOption"
              :value="item.value"
              :key="index"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
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
import { provinceOption } from "./option.js";
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      provinceOption,
      Form: {
        IF5url: "",
        IF6url: "",
        IFAurl: "",
        province: "GUD",
        radio: true,
      },
      rules: {
        // IF5url: [{ validator: Validate.checkNull }],
        // IF6url: [{ validator: Validate.checkNull }],
        // IFAurl: [{ validator: Validate.checkNull }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.AND_LINK,
      });
      this.$refs["Form"].resetFields();
      for (let key in this.Form) {
        if (res.hasOwnProperty(key)) {
          this.Form[key] = res[key];
        }
      }
      this.Form.radio = this.Form.radio == "1";
      this.Form.province = this.Form.province || "GUD";
    },
    postData() {
      this.$loading_tool({ loading: true });
      let json = {
        radio: this.Form.radio ? "1" : "0",
        IF5url: this.Form.IF5url,
        IF6url: this.Form.IF6url,
        IFAurl: this.Form.IFAurl,
        province: this.Form.province,
        cmd: this.$CMD.AND_LINK,
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
    switchChange(e) {
      this.$refs["Form"].resetFields();
    },
    submitForm(formName) {
      if (!this.Form.radio) {
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