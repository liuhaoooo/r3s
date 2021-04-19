<template>
  <a-empty :image-style="{ height: '100px' }" v-show="isBradge_Relay">
    <span slot="description"> {{$t('tips.isBradge_Relay')}} </span>
    <a-button type="primary" @click="$router.push({name:'Broadband'})"> 前往切换 </a-button>
  </a-empty>
</template>

<script>
import store from "../store";
export default {
  computed: {
    isBradge_Relay: () => store.getters["sysStatus/isBradge_Relay"],
  },
};
</script>