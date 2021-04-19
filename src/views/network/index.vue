<template>
  <div class="network">
    <div class="menu">
      <a-menu
        mode="inline"
        v-model:selectedKeys="selectedKeys"
        :open-keys="openKeys"
        style="width: 100%; background: none"
        @openChange="onOpenChange"
      >
        <a-sub-menu
          v-for="items in meunList"
          :key="items.key"
          class="menu-items"
          :disabled="items.disabled"
        >
          <span slot="title">
            <span v-if="items.disabled">
              <a-tooltip placement="right">
                <span slot="title">已禁用</span>
                {{ items.title }}
              </a-tooltip>
            </span>
            <span v-else>{{ items.title }}</span>
          </span>
          <a-menu-item
            @click="itemSelect(item)"
            class="menu-item"
            :key="item.key"
            v-for="item in items.child"
            :disabled="item.disabled"
          >
            <a-tooltip placement="right" v-if="item.disabled">
              <span slot="title">已禁用</span>
              {{ item.title }}
            </a-tooltip>
            <span v-else>{{ item.title }}</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
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
      rootSubmenuKeys: ["1", "2", "3", "4", "5", "6", "7"],
      openKeys: ["1"],
      selectedKeys: ["1-1"],
      enter_active_class: "animate__slideInUp",
      leave_active_class: "animate__slideOutUp",
    };
  },
  computed: {
    meunList: () => store.getters["routes/networkRoutes"],
  },
  mounted() {
    let key = this.$route.meta.key;
    this.openKeys = [key.split("-")[0]];
    this.selectedKeys = [this.$route.meta.key];
  },
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        let i = openKeys[openKeys.length - 1];
        this.selectedKeys = [`${i}-1`];
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
        this.$router.push({ name: this.meunList[i - 1].child[0].route });
      }
    },
    itemSelect(item) {
      this.$router.push({ name: item.route });
    },
  },
  watch: {
    selectedKeys: {
      handler(n, o) {
        let newN = n[0].split("-"),
          newO = o[0].split("-");
        if (newN[0] == newO[0]) {
          if (newN[1] > newO[1]) {
            this.enter_active_class = "animate__slideInUp";
            this.leave_active_class = "animate__slideOutUp";
          } else {
            this.enter_active_class = "animate__slideInDown";
            this.leave_active_class = "animate__slideOutDown";
          }
        } else if (newN[0] > newO[0]) {
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