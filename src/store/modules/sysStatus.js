import { axiosRequest_post, axiosRequest_get } from "../../utils/request";
import { CMD } from "../../config/cmd";
import { date_tool,parseHexPageHide_tool } from "../../utils/tools";
const state = {
    isMore:false,
    themeColor:"#16cdab",//主题颜色
    needRedirect: false, //是否需要重定向
    configInfo: {},//设备配置信息
    deviceInfo: {},//设备系统信息
    wifiInfo_24: {},//2.4Gwifi 信息
    wifiInfo_5: {},//5Gwifi 信息
    meshStatus: {},//MESH状态
    networkInfo: {},//网络状态get
}
const getters = {
    deviceInfo: (state) => {
        let deviceInfo = JSON.parse(JSON.stringify(state.deviceInfo))
        const reg = new RegExp(" kB");
        try {
            deviceInfo.uptime = date_tool(state.deviceInfo.uptime)
            let memory = state.deviceInfo.memory.split(',')
            deviceInfo.memory1 = Number(memory[0].replace(reg, ""))
            deviceInfo.memory2 = Number(memory[1].replace(reg, ""))
            deviceInfo.memory3 = Number(memory[2].replace(reg, ""))
            deviceInfo.memory4 = deviceInfo.memory1 - deviceInfo.memory2 - deviceInfo.memory3
        } catch (error) { }
        return deviceInfo
    },
    account_level: (state) => state.configInfo.account_level,
    webPageFlag:(state)=>{
        let webPageFlag = parseHexPageHide_tool(state.configInfo.web_page_hide).split("").reverse()
        return webPageFlag
    },
    meshOpen: (state) => {
        return state.meshStatus.mesh_switch == '1'
    },
    //是否中继模式
    isRelay:(state)=>{
        return state.networkInfo.real_wan_mode == "APClient"
    },
    //是否桥接中继模式
    isBradge_Relay:(state)=>{
        return state.networkInfo.real_wan_mode == "Bridge" || state.networkInfo.real_wan_mode == "APClient"
    },
    //主2.4wifi开关
    wifiOpen_24:(state) => {
        return state.wifiInfo_24.wifiOpen == '1'
    },
    //主5wifi开关
    wifiOpen_5:(state) => {
        return state.wifiInfo_5.wifiOpen == '1'
    },
    //是否5G优选
    is5G:(state) => {
        return state.wifiInfo_5.wifiSames == '1'
    },
}
const mutations = {
    setIsMore: (state, data) => {
        state.isMore = data
    },
    setThemeColor: (state, data) => {
        state.themeColor = data
    },
    setNeedRedirect: (state, data) => {
        state.needRedirect = data
    },
    setConfigInfo: (state, data) => {
        state.configInfo = data
    },
    setDeviceInfo: (state, data) => {
        state.deviceInfo = data
    },
    setWifiInfo_24: (state, data) => {
        state.wifiInfo_24 = data
    },
    setWifiInfo_5: (state, data) => {
        state.wifiInfo_5 = data
    },
    setMeshStatus: (state, data) => {
        state.meshStatus = data
    },
    setNetworkInfo: (state, data) => {
        state.networkInfo = data
    },
}
const actions = {
    getConfigInfo: async (state, data) => {
        let res = await axiosRequest_get({ cmd: CMD.INIT_PAGE });
        state.commit('setConfigInfo', res)
    },
    getDeviceInfo: async (state, data) => {
        let res = await axiosRequest_get({ cmd: CMD.DEVICE_INFO });
        state.commit('setDeviceInfo', res)
    },
    getWifiInfo: async (state, data) => {
        let res_24 = await axiosRequest_get({ cmd: CMD.WIRELESS_CONFIG, subcmd: 0 });
        let res_5 = await axiosRequest_get({ cmd: CMD.WIRELESS5G_CONFIG, subcmd: 0 });
        state.commit('setWifiInfo_24', res_24)
        state.commit('setWifiInfo_5', res_5)
    },
    getMeshStatus: async (state, data) => {
        let res = await axiosRequest_get({ cmd: CMD.MESH_SETTING, networking: '0' });
        state.commit('setMeshStatus', res)
    },
    getNetworkInfo: async (state, data) => {
        let res = await axiosRequest_get({ cmd: CMD.NETWORK_INFO });
        state.commit('setNetworkInfo', res)
    },
}
export default { state, getters, mutations, actions }