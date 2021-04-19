<template>
  <div>
    <headerInfo
      :labelText="$t('help.title21')"
      :spanText="$t('help.details21')"
    />
    <a-button type="primary" icon="sync" @click="getLog">
      {{ $t("diagnosis.refresh") }}
    </a-button>
    <a-spin :spinning="loading" :indicator="indicator">
      <textarea
        ref="textarea"
        v-model="logInfo"
        class="log-content"
        readonly
      ></textarea>
    </a-spin>
  </div>
</template>

<script>
import headerInfo from "../../components/headerInfo.vue";
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      indicator: (
        <a-icon type="loading-3-quarters" style="font-size: 24px" spin />
      ),
      logInfo: "",
      loading: false,
    };
  },
  mounted() {
    this.getLog();
  },
  methods: {
    async getLog() {
      this.loading = true;
      let res = await this.$axiosRequest_get({ cmd: this.$CMD.SYS_LOG });
      this.logInfo = res;
      setTimeout(() => {
        this.$refs.textarea.scrollTop = this.$refs.textarea.scrollHeight;
        this.loading = false;
      }, 100);
    },
  },
};
</script>