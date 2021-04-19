<template>
  <div>
    <headerInfo
      :labelText="$t('help.title23')"
      :spanText="$t('help.details23')"
    />
    <a-form-model ref="Form" layout="inline" :model="Form" :rules="rules">
      <a-form-model-item :label="$t('diagnosis.ipurl')" prop="url">
        <a-input v-model="Form.url" :disabled="loading" />
      </a-form-model-item>
      <a-form-model-item :label="$t('diagnosis.port')" prop="port">
        <a-input v-model="Form.port" :disabled="loading" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" v-show="loading" @click="stopClick"
          >{{$t('diagnosis.stop')}}</a-button
        >
        <a-button type="primary" @click="submitForm('Form')" v-show="!loading"
          >{{$t('diagnosis.start')}}</a-button
        >
      </a-form-model-item>
    </a-form-model>
    <textarea
      ref="textarea"
      v-model="traceInfo"
      class="trace-content"
      readonly
    ></textarea>
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
      stop: false,
      traceInfo: "",
      loading: false,
      count: 0,
      Form: {
        port: "80",
        url: "192.168.0.1",
      },
      rules: {
        port: [{ validator: Validate.checkPort, trigger: "change" }],
        url: [{ validator: Validate.checkNull, trigger: "change" }],
      },
    };
  },
  methods: {
    postData(stopped) {
      this.loading = true;
      let json = {
        cmd: this.$CMD.NETWORK_TOOLS,
        subcmd: 2,
        stopped: stopped ? "1" : "0",
        port: Number(this.Form.port),
        url: this.Form.url,
      };
      this.$axiosRequest_post(json).then((res) => {
        if (res.success && !stopped) {
          this.count = 0;
          this.stop = false;
          this.getData();
        }
      });
    },
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.GET_FILE_DATA,
        url: "/tmp/tzwww/tracepathrt",
        subcmd: this.$CMD.NETWORK_TOOLS,
      });
      this.traceInfo = res;
      this.$refs.textarea.scrollTop = this.$refs.textarea.scrollHeight;
      if (this.count < 3600 && !this.stop) {
        setTimeout(() => {
          this.getData();
          this.getStatus();
          this.count++;
        }, 3000);
      } else {
        this.loading = false;
        this.stop = false;
      }
    },
    async getStatus() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.NETWORK_TOOLS,
        subcmd: 2,
      });
      res.message == "1" && this.stopClick();
    },
    stopClick() {
      this.stop = true;
      this.postData(true);
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