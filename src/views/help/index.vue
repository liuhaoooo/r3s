<template>
  <div style="padding-top: 20px">
    <div class="help_content_flex">
      <a-timeline class="left my_content" id="scrollBox">
        <a-timeline-item
          color="gray"
          class="helpItem"
          :id="'helpItem' + index"
          v-for="(item, index) in helpList"
          :key="index"
        >
          <a-icon
            slot="dot"
            type="caret-right"
            class="mytext-color"
            style="font-size: 1rem;"
            v-if="index == selectIndex"
          />
          <h3>{{ item.title }}</h3>
          <div v-for="(p, key) in item.child" :key="key">
            <span class="mytext-color">{{ key }}</span>
            <p v-html="p"></p>
          </div>
        </a-timeline-item>
      </a-timeline>
      <a-tabs
        tab-position="right"
        v-model.activeKey="selectIndex"
        size="small"
        @change="scrollToPosition"
      >
        <a-tab-pane
          v-for="(item, index) in helpList"
          :key="index"
          :tab="item.title"
        >
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { helpList } from "./help.js";
export default {
  data() {
    return {
      selectIndex: 0,
      helpList,
      scrollBox: null,
    };
  },
  mounted() {
    this.initScroll();
  },
  beforeDestroy() {
    this.scrollBox.removeEventListener("scroll",()=>{})
  },
  methods: {
    scrollToPosition(index) {
      this.selectIndex = index;
      document.getElementById("helpItem" + index).scrollIntoView();
    },
    initScroll() {
      this.scrollBox = document.getElementById("scrollBox");
      const helpItem = document.getElementsByClassName("helpItem");
      const topArr = [];
      for (let i = 0; i < helpItem.length; i++) {
        topArr.push(helpItem[i].offsetTop)
      }
      this.scrollBox.addEventListener("scroll",() => {
          const current_offset_top = this.scrollBox.scrollTop;
          for (let i = 0; i < topArr.length; i++) {
            if (current_offset_top <= topArr[i] + 50) {
              this.selectIndex = i;
              break;
            }
          }
        },true);
    },
  },
};
</script>