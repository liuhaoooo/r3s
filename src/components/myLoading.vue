<template>
  <div class="myLoading">
    <a-modal
      v-model="loading"
      centered
      :closable="false"
      :footer="null"
      :maskClosable="false"
      width="350px"
      :afterClose="afterClose"
    >
      <div class="loadingModal-content">
        <div>
          <icon-font
            type="icon-jiazai"
            spin
            class="mytext-color"
            :style="{ fontSize: '60px' }"
            v-show="!isProgress"
          />
          <a-progress
            type="circle"
            :percent="percent"
            v-show="isProgress"
            strokeColor="#16cdab"
          />
        </div>
        <span style="color: #999">{{ loadingText }}</span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { Icon } from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: require("../config/iconfont.js"),
});
export default {
  components: {
    IconFont,
  },
  data() {
    return {
      percent: 0,
    };
  },
  computed: {
    ...mapState("loading", {
      loading: (state) => state.loading,
      isProgress: (state) => state.isProgress,
      loadingText: (state) => state.loadingText,
      progressTime: (state) => state.progressTime,
    }),
  },
  watch: {
    loading() {
      if (!this.loading) {
        this.percent = 100;
      } else {
        this.percent = 0;
        this.addPercent();
      }
    },
  },
  methods: {
    addPercent() {
      this.percent += 1;
      if (this.percent < 97) {
        setTimeout(() => {
          this.addPercent();
        }, this.progressTime);
      }
    },
    afterClose() {
      this.percent = 0;
    },
  },
};
</script>