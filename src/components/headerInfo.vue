<template>
  <div class="headerInfo">
    <div class="headerInfo-L">
      <label for="">{{ labelText }}</label>
      <span>{{ spanText }}</span>
    </div>
    <div class="headerInfo-R">
      <a target="_blank" @click="toHelp">{{ linkTo === "" ? $t("tips.moreHelp") : '更多设置' }}</a>
      <a-icon type="arrow-right" class="mytext-color" v-show="linkTo !== ''"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    labelText: {
      type: String,
      default: ""
    },
    spanText: {
      type: String,
      default: ""
    },
    linkTo: {
      type: String,
      default: ""
    }
  },
  methods: {
    toHelp() {
      this.$router.push({ name: this.linkTo || "Help" });
    },
  },
};
</script>