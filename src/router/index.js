/**
 * @meta:{id:头部菜单的索引,key:菜单的索引,animateIndex:根据该值判断动画方向}
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: "/home",
    component: Index,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/login/login.vue')
      },
      {
        path: 'home',
        name: 'Home',
        redirect: "home/simple_home",
        component: () => import('../views/Home.vue'),
        children: [
          //simple
          {
            path: 'simple_home',
            name: 'Simple_home',
            meta: { id: 0, isSimple: true, animateIndex: 0 },
            component: () => import('../views/simple_views/home.vue')
          },
          {
            path: 'simple_network',
            name: 'Simple_network',
            meta: { id: 1, isSimple: true, animateIndex: 1 },
            component: () => import('../views/simple_views/networkSetting.vue')
          },
          {
            path: 'simple_wifi',
            name: 'Simple_wifi',
            meta: { id: 2, isSimple: true, animateIndex: 2 },
            component: () => import('../views/simple_views/wifiSetting.vue')
          },
          {
            path: 'simple_terminal',
            name: 'Simple_terminal',
            meta: { id: 3, isSimple: true, animateIndex: 3 },
            component: () => import('../views/simple_views/terminal.vue')
          },
          //more
          {
            path: 'status',
            name: 'Status',
            meta: { id: 0, animateIndex: 4 },
            component: () => import('../views/status/index.vue')
          },
          {
            path: 'network',
            name: 'Network',
            meta: { id: 1, animateIndex: 5 },
            redirect: "network/broadband",
            component: () => import('../views/network/index.vue'),
            children: [
              {
                path: 'broadband',
                name: 'Broadband',
                meta: { id: 1, key: '1-1', animateIndex: 5 },
                component: () => import('../views/network/broadbandSettings/index.vue')
              },
              {
                path: 'relay',
                name: 'Relay',
                meta: { id: 1, key: '1-2', animateIndex: 5 },
                component: () => import('../views/network/relay.vue')
              },
              {
                path: 'iptv',
                name: 'Iptv',
                meta: { id: 1, key: '1-3', animateIndex: 5 },
                component: () => import('../views/network/iptvSetting.vue')
              },
              {
                path: 'dhcp4',
                name: 'Dhcp4',
                meta: { id: 1, key: '2-1', animateIndex: 5 },
                component: () => import('../views/network/dhcp.vue')
              },
              // {
              //   path: 'dhcp6',
              //   name: 'Dhcp6',
              //   meta: { id: 1, key: '2-2' },
              //   component: () => import('../views/network/dhcpIPv6.vue')
              // },
              {
                path: 'mesh',
                name: 'Mesh',
                meta: { id: 1, key: '2-2', animateIndex: 5 },
                component: () => import('../views/network/mesh.vue')
              },
              {
                path: 'ipmac_reservation',
                name: 'Reservation',
                meta: { id: 1, key: '2-3', animateIndex: 5 },
                component: () => import('../views/network/ipmac_reservation.vue')
              },
              {
                path: 'wifi24g',
                name: 'Wifi24g',
                meta: { id: 1, key: '3-1', animateIndex: 5 },
                component: () => import('../views/network/wifi24Setting.vue')
              },
              {
                path: 'wifi24gadv',
                name: 'Wifi24gadv',
                meta: { id: 1, key: '3-2', animateIndex: 5 },
                component: () => import('../views/network/wifi24advSetting.vue')
              },
              {
                path: 'wifi5g',
                name: 'Wifi5g',
                meta: { id: 1, key: '4-1', animateIndex: 5 },
                component: () => import('../views/network/wifi5Setting.vue')
              },
              {
                path: 'wifi5gadv',
                name: 'Wifi5gadv',
                meta: { id: 1, key: '4-2', animateIndex: 5 },
                component: () => import('../views/network/wifi5advSetting.vue')
              },
              {
                path: 'wpsSetting',
                name: 'WpsSetting',
                meta: { id: 1, key: '5-1', animateIndex: 5 },
                component: () => import('../views/network/wpsSetting.vue')
              },
              {
                path: 'andLink',
                name: 'AndLink',
                meta: { id: 1, key: '6-1', animateIndex: 5 },
                component: () => import('../views/network/andLinkSettings.vue')
              },
              {
                path: 'routeList',
                name: 'RouteList',
                meta: { id: 1, key: '7-1', animateIndex: 5 },
                component: () => import('../views/network/routeList.vue')
              },
            ]
          },
          {
            path: 'secure',
            name: 'Secure',
            meta: { id: 2, animateIndex: 6 },
            redirect: "secure/firewall",
            component: () => import('../views/secure/index.vue'),
            children: [
              {
                path: 'firewall',
                name: 'Firewall',
                meta: { id: 2, key: 0, animateIndex: 6 },
                component: () => import('../views/secure/firewall.vue')
              },
              {
                path: 'filter',
                name: 'Filter',
                meta: { id: 2, key: 1, animateIndex: 6 },
                component: () => import('../views/secure/filter.vue')
              },
              {
                path: 'ipmac_bind',
                name: 'IpmacBind',
                meta: { id: 2, key: 2, animateIndex: 6 },
                component: () => import('../views/secure/ipmac_bind.vue')
              },
              {
                path: 'portMapping',
                name: 'PortMapping',
                meta: { id: 2, key: 3, animateIndex: 6 },
                component: () => import('../views/secure/portMapping.vue')
              },
              {
                path: 'filter_url',
                name: 'UrlFilter',
                meta: { id: 2, key: 4, animateIndex: 6 },
                component: () => import('../views/secure/filter_url.vue')
              },
              {
                path: 'filter_acl',
                name: 'Filter_acl',
                meta: { id: 2, key: 5, animateIndex: 6 },
                component: () => import('../views/secure/filter_acl.vue')
              },
            ]
          },
          {
            path: 'manage',
            name: 'Manage',
            meta: { id: 3, animateIndex: 7 },
            redirect: "manage/sysUpdate",
            component: () => import('../views/manage/index.vue'),
            children: [
              {
                path: 'sysUpdate',
                name: 'SysUpdate',
                meta: { id: 3, key: 0, animateIndex: 7 },
                component: () => import('../views/manage/sysUpdate.vue')
              },
              {
                path: 'changePassword',
                name: 'ChangePassword',
                meta: { id: 3, key: 1, animateIndex: 7 },
                component: () => import('../views/manage/changePassword.vue')
              },
              {
                path: 'timeZoneSetting',
                name: 'TimeZone',
                meta: { id: 3, key: 2, animateIndex: 7 },
                component: () => import('../views/manage/timeZoneSetting.vue')
              },
              {
                path: 'scheduledRestart',
                name: 'ScheduledRestart',
                meta: { id: 3, key: 3, animateIndex: 7 },
                component: () => import('../views/manage/scheduledRestart.vue')
              },
              {
                path: 'sysSetting',
                name: 'SysSetting',
                meta: { id: 3, key: 4, animateIndex: 7 },
                component: () => import('../views/manage/sysSetting.vue')
              },
            ]
          },
          {
            path: 'diagnosis',
            name: 'Diagnosis',
            meta: { id: 4, animateIndex: 8 },
            redirect: "diagnosis/sysLog",
            component: () => import('../views/diagnosis/index.vue'),
            children: [
              {
                path: 'sysLog',
                name: 'SysLog',
                meta: { id: 4, key: 0, animateIndex: 8 },
                component: () => import('../views/diagnosis/sysLog.vue')
              },
              {
                path: 'ping',
                name: 'Ping',
                meta: { id: 4, key: 1, animateIndex: 8 },
                component: () => import('../views/diagnosis/ping.vue')
              },
              {
                path: 'trace',
                name: 'Trace',
                meta: { id: 4, key: 2, animateIndex: 8 },
                component: () => import('../views/diagnosis/trace.vue')
              },
            ]
          },
          {
            path: 'help',
            name: 'Help',
            meta: { id: 5, animateIndex: 9 },
            component: () => import('../views/help/index.vue')
          }
        ]
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {  //如果未匹配到路由
    from.name ? next({ name: from.name }) : next({ name: 'Login' });
  } else if (to.name !== 'Login' && !sessionStorage['sessionId']) next({ name: 'Login' })
  else next()
})
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
export default router
