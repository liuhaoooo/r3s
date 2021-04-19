<template>
  <div class="menu_content">
    <div class="menu">
      <div
        v-for="(item, index) in meunList"
        :key="index"
        class="menu-item"
        :class="itemIndex == index ? 'menu-item-select' : ''"
        @click="itemSelect(item, index)"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="content">
      <transition
        :duration="{ enter: 180, leave: 130 }"
        mode="out-in"
        :enter-active-class="`animate__animated ${enter_active_class}`"
        :leave-active-class="`animate__animated ${leave_active_class}`"
      >
        <router-view />
      </transition>
    </div>
  </div>
</template>
<script>
import store from "../../store";
export default {
  data() {
    return {
      itemIndex: 0,
      enter_active_class: "animate__slideInUp",
      leave_active_class: "animate__slideOutUp",
    };
  },
  computed: {
    meunList: () => store.getters["routes/manageRoutes"],
  },
  mounted() {
    this.itemIndex = this.$route.meta.key;
  },
  methods: {
    itemSelect(item, index) {
      this.itemIndex = index;
      this.$router.push({ name: item.route });
    },
  },
  watch: {
    itemIndex: {
      handler(n, o) {
        if (n > o) {
          this.enter_active_class = "animate__slideInUp";
          this.leave_active_class = "animate__slideOutUp";
        } else {
          this.enter_active_class = "animate__slideInDown";
          this.leave_active_class = "animate__slideOutDown";
        }
      },
    },
  },
};
</script>
