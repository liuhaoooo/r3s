import "@babel/polyfill"
import Vue from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import router from './router'
import store from './store'
import animated from 'animate.css'
import { CMD } from "./config/cmd";
import { loading_tool } from "./utils/tools";
import { axiosRequest_post, axiosRequest_get, axiosRequest_upload } from "./utils/request";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

Vue.config.productionTip = false
Vue.use(Antd);
Vue.use(animated);
Vue.prototype.$CMD = CMD
Vue.prototype.$axiosRequest_post = axiosRequest_post
Vue.prototype.$axiosRequest_get = axiosRequest_get
Vue.prototype.$axiosRequest_upload = axiosRequest_upload
Vue.prototype.$loading_tool = loading_tool

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
