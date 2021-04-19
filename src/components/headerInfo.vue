<template>
  <div class="headerInfo">
    <div class="headerInfo-L">
      <label for="">{{ labelText }}</label>
      <span>{{ spanText }}</span>
    </div>
    <div class="headerInfo-R">
      <a target="_blank" @click="toHelp">{{ $t("tips.moreHelp") }}</a>
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
    },
    spanText: {
      type: String,
    },
  },
  methods: {
    //跳转到help
    toHelp() {
      this.$router.push({ name: "Help" });
    },
  },
};
</script>