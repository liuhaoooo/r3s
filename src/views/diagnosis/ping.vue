<template>
  <div>
    <headerInfo
      :labelText="$t('help.title22')"
      :spanText="$t('help.details22')"
    />
    <a-form-model ref="Form" layout="inline" :model="Form" :rules="rules">
      <a-form-model-item :label="$t('diagnosis.loop')">
        <a-switch v-model="loop" :disabled="loading" />
      </a-form-model-item>
      <a-form-model-item :label="$t('diagnosis.num')" prop="pingTimes">
        <a-input v-model="Form.pingTimes" :disabled="loop || loading" />
      </a-form-model-item>
      <a-form-model-item :label="$t('diagnosis.ipurl')" prop="url">
        <a-input v-model="Form.url" :disabled="loading" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" v-show="loading" @click="stopClick">{{$t('diagnosis.stop')}}</a-button>
        <a-button type="primary" @click="submitForm('Form')" v-show="!loading">{{$t('diagnosis.start')}}</a-button>
      </a-form-model-item>
    </a-form-model>
    <textarea ref="textarea" v-model="pingInfo" class="ping-content" readonly></textarea>
  </div>
</template>

<script>
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
const pingTimes = (rule, value, callback) => {
  Validate.checkRange(value, [1, 999], callback);
};
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      stop: false,
      pingInfo: "",
      loop: false,
      loading: false,
      count: 0,
      Form: {
        pingTimes: "10",
        url: "192.168.0.1",
      },
      rules: {
        pingTimes: [{ validator: pingTimes, trigger: "change" }],
        url: [{ validator: Validate.checkNull, trigger: "change" }],
      },
    };
  },
  methods: {
    postData(pingTimes) {
      this.loading = true;
      let json = {
        cmd: this.$CMD.NETWORK_TOOLS,
        subcmd: 0,
        pingTimes: pingTimes != undefined ? pingTimes : this.loop ? -1 : Number(this.Form.pingTimes),
        url: this.Form.url,
      };
      this.$axiosRequest_post(json).then((res) => {
        if (res.success && pingTimes == undefined) {
          this.count = Number(this.Form.pingTimes);
          this.stop = false;
          this.getData();
        }
      });
    },
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.GET_FILE_DATA,
        url: "/tmp/tzwww/pingrt",
        subcmd: this.$CMD.NETWORK_TOOLS,
      });
      this.pingInfo = res;
      if(res.indexOf('bad address') != -1){
        this.stop = true
      }
      this.$refs.textarea.scrollTop = this.$refs.textarea.scrollHeight;
      if ((this.count > 0 || this.loop) && !this.stop) {
        setTimeout(() => {
          this.getData();
          this.count--;
        }, 1000);
      } else {
        this.loading = false;
        this.stop = false;
      }
    },
    stopClick(){
      this.stop = true
      this.postData(0);
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