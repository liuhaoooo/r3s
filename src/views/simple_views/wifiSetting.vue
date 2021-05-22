<template>
  <div class="simple_wifi_content">
    <headerInfo labelText="Wi-Fi设置" spanText="" linkTo="Wifi24g" />
    <div class="content">
      <a-form-model
        ref="Form"
        :model="Form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-model-item :label="'5G 优选'">
          <a-switch v-model="Form.radio" class="my_margin_top"/>
          <span class="ant-form-text">
            2.4G和5G网络合并显示，同等信号强度下，优选速度更快的5G网络。
          </span>
        </a-form-model-item>
        <a-divider class="mytext-color">
          2.4G Wi-Fi
        </a-divider>
        <a-form-model-item :label="'Wi-Fi名称'" prop="IF6url">
          <a-input
            v-model="Form.IF6url"
            :disabled="!Form.radio"
            :maxLength="50"
          />
        </a-form-model-item>
        <a-form-model-item :label="'Wi-Fi密码'" prop="IF5url">
          <a-input-password
            v-model="Form.IF5url"
            :disabled="!Form.radio"
            :maxLength="50"
          />
        </a-form-model-item>
        <a-divider class="mytext-color">
          5G Wi-Fi
        </a-divider>
        <a-form-model-item :label="'Wi-Fi名称'" prop="IF6url">
          <a-input
            v-model="Form.IF6url"
            :disabled="!Form.radio"
            :maxLength="50"
          />
        </a-form-model-item>
        <a-form-model-item :label="'Wi-Fi密码'" prop="IF5url">
          <a-input-password
            v-model="Form.IF5url"
            :disabled="!Form.radio"
            :maxLength="50"
          />
        </a-form-model-item>
        <a-divider />
        <a-form-model-item :label="'WiFi5备用网络'">
          <a-switch v-model="Form.radio" />
          <span class="ant-form-text">
            一些旧设备支持WiFi6效果不好，可能出现扫描不到WiFi信号，连接不上WiFi等情况。开启此开关就能兼容这一类旧设备。
          </span>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 10, offset: 9 }">
          <a-button type="primary" @click="submitForm('Form')">{{
            $t("tips.ok")
          }}</a-button>
          <a-button style="margin-left: 80px" @click="getData">{{
            $t("tips.cancel")
          }}</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script>
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      Form: {
        IF5url: "",
        IF6url: "",
        IFAurl: "",
        province: "GUD",
        radio: true,
      },
      rules: {
        IF5url: [{ validator: Validate.checkNull }],
        IF6url: [{ validator: Validate.checkNull }],
        IFAurl: [{ validator: Validate.checkNull }],
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