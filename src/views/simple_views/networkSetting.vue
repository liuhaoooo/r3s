<template>
  <div class="simple_networkSetting_content">
    <headerInfo labelText="上网设置" spanText="" linkTo="Broadband" />
    <a-form-model
      :model="form"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 10 }"
      style="margin-top: 50px"
    >
      <a-form-model-item label="模式选择">
        <a-select v-model="form.linkType">
          <a-select-option value="Bridge"> 桥模式 </a-select-option>
          <a-select-option value="Route"> 路由模式 </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item></a-form-model-item>
      <a-form-model-item></a-form-model-item>
      <a-form-model-item label="上网方式">
        <a-select
          v-model="form.linkType1"
          :disabled="form.linkType == 'Bridge'"
        >
          <a-select-option value="linkIP"> IP </a-select-option>
          <a-select-option value="linkPPP"> PPPOE </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item></a-form-model-item>
      <a-form-model-item></a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 10, offset: 9 }">
        <a-button type="primary" @click="postData">{{
          $t("tips.ok")
        }}</a-button>
        <a-button style="margin-left: 80px" @click="getData">{{
          $t("tips.cancel")
        }}</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import store from "../../store";
import headerInfo from "../../components/headerInfo.vue";
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      form: {
        linkType: "Bridge",
        linkType1: "linkIP",
      },
    };
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    clearInterval(window.getSuccessStatus);
  },
  methods: {
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.BROADBAND_SETTING,
      });
      console.log(res.linkType);
    },
    postData() {
      this.$loading_tool({ loading: true });
      let json = {
        cmd: this.$CMD.BROADBAND_SETTING,
      };
      this.$axiosRequest_post(json).then((res) => {
        clearInterval(window.getSuccessStatus);
        if (res.success) {
          store.dispatch("sysStatus/getNetworkInfo"); //更新vuex状态
          this.$loading_tool({ loading: false });
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$loading_tool({ loading: false });
          this.$message.error(this.$t("tips.setFail"));
        }
      });
      clearInterval(window.getSuccessStatus);
      window.getSuccessStatus = setInterval(() => {
        this.getSuccessStatus();
      }, 3000);
    },
    getSuccessStatus() {
      this.$axiosRequest_get({
        cmd: this.$CMD.GET_DEVICE_NAME,
      }).then((res) => {
        if (res.success) {
          clearInterval(window.getSuccessStatus);
          this.$loading_tool({ loading: false });
          this.$message.success(this.$t("tips.setSuccess"));
          store.dispatch("sysStatus/getNetworkInfo"); //更新vuex状态
        }
      });
    },
  },
};
</script>