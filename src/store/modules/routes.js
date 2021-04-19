import { i18n } from "../../i18n"
import * as sysStatus from './sysStatus.js'
import { pageHideCheck_tool } from "../../utils/tools";
const state = {
    networkRoutes: [
        {
            title: "broadbandSet",
            key: "1",
            show: true,
            disabled: false,
            child: [
                {
                    title: "broadbandSet",
                    key: "1-1",
                    route: "Broadband",
                    show: true,
                    disabled: false,
                },
                {
                    title: "relay",
                    key: "1-2",
                    route: "Relay",
                    show: true,
                    disabled: false,
                },
            ]
        },
        {
            title: "lanSet",
            key: "2",
            show: true,
            disabled: false,
            child: [
                {
                    title: "dhcp4",
                    key: "2-1",
                    route: "Dhcp4",
                    show: true,
                    disabled: false,
                },
                {
                    title: "mesh",
                    key: "2-2",
                    route: "Mesh",
                    show: true,
                    disabled: false,
                },
                {
                    title: "ipmac_reservation",
                    key: "2-3",
                    route: "Reservation",
                    show: true,
                    disabled: false,
                },
            ]
        },
        {
            title: "wlanSet",
            key: "3",
            show: true,
            disabled: false,
            child: [
                {
                    title: "wlanSet",
                    key: "3-1",
                    route: "Wifi24g",
                    show: true,
                    disabled: false,
                },
                {
                    title: "wlanAdvSet",
                    key: "3-2",
                    route: "Wifi24gadv",
                    show: true,
                    disabled: false,
                }
            ]
        },
        {
            title: "wlan5gSet",
            key: "4",
            show: true,
            disabled: false,
            child: [
                {
                    title: "wlan5gSet",
                    key: "4-1",
                    route: "Wifi5g",
                    show: true,
                    disabled: false,
                },
                {
                    title: "wlan5gAdvSet",
                    key: "4-2",
                    route: "Wifi5gadv",
                    show: true,
                    disabled: false,
                }
            ]
        },
        {
            title: "wpsSetting",
            key: "5",
            show: true,
            disabled: false,
            child: [
                {
                    title: "wpsSetting",
                    key: "5-1",
                    route: "WpsSetting",
                    show: true,
                    disabled: false,
                }
            ]
        },
        {
            title: "routeSet",
            key: "6",
            show: true,
            disabled: false,
            child: [
                {
                    title: "routeSet",
                    key: "6-1",
                    route: "RouteList",
                    show: true,
                    disabled: false,
                }
            ]
        },
        {
            title: "andlink",
            key: "7",
            show: true,
            disabled: false,
            child: [
                {
                    title: "andlink",
                    key: "7-1",
                    route: "AndLink",
                    show: true,
                    disabled: false,
                }
            ]
        }
    ],
    firewallRoutes: [
        {
            title: "firewall",
            key: "1",
            show: true,
            disabled: false,
            route: "Firewall",
        },
        {
            title: "filter",
            key: "2",
            show: true,
            disabled: false,
            route: "Filter",
        },
        {
            title: "urlFilter",
            key: "3",
            show: true,
            disabled: false,
            route: "UrlFilter",
        },
        {
            title: "ipmac",
            key: "4",
            show: true,
            disabled: false,
            route: "IpmacBind",
        },
        {
            title: "portMapping",
            key: "5",
            show: true,
            disabled: false,
            route: "PortMapping",
        },
        {
            title: "filter_acl",
            key: "6",
            show: true,
            disabled: false,
            route: "Filter_acl",
        },
    ],
    manageRoutes: [
        {
            title: "sysUpdate",
            key: "1",
            show: true,
            disabled: false,
            route: "SysUpdate",
        },
        {
            title: "changePassword",
            key: "2",
            show: true,
            disabled: false,
            route: "ChangePassword",
        },
        {
            title: "sysSetting",
            key: "3",
            show: sysStatus.default.getters["account_level"] == '1',
            disabled: false,
            route: "SysSetting",
        },
    ],
    diagnosisRoutes: [
        {
            title: "sysLog",
            key: "1",
            show: true,
            disabled: false,
            route: "SysLog",
        },
        {
            title: "ping",
            key: "2",
            show: true,
            disabled: false,
            route: "Ping",
        },
        {
            title: "trace",
            key: "3",
            show: true,
            disabled: false,
            route: "Trace",
        },
    ]
}
const getters = {
    networkRoutes: state => {
        let pages = JSON.parse(JSON.stringify(state.networkRoutes)), newPage = [];
        for (let n in pages) {
            pages[n].title = i18n.t("network_page." + pages[n].title)
            let child = pages[n].child,
                newChild = [];
            if (child.length > 0) {
                for (let i in child) {
                    child[i].title = i18n.t("network_page." + child[i].title)
                    if (pageHideCheck_tool(child[i].show) || child[i].show === true) {
                        newChild.push(child[i]);
                    }
                }
            }
            pages[n]["child"] = newChild;
            if (pages[n].show === true && pages[n].child.length > 0) {
                newPage.push(pages[n])
            }
        }
        return newPage;
    },
    firewallRoutes: state => {
        let pages = JSON.parse(JSON.stringify(state.firewallRoutes)), newPage = [];
        for (let n in pages) {
            pages[n].title = i18n.t("firewall." + pages[n].title)
            if (pageHideCheck_tool(pages[n].show) || pages[n].show === true) {
                newPage.push(pages[n])
            }
        }
        return newPage;
    },
    manageRoutes: state => {
        let pages = JSON.parse(JSON.stringify(state.manageRoutes)), newPage = [];
        for (let n in pages) {
            pages[n].title = i18n.t("manage." + pages[n].title)
            if (pageHideCheck_tool(pages[n].show) || pages[n].show === true) {
                newPage.push(pages[n])
            }
        }
        return newPage;
    },
    diagnosisRoutes: state => {
        let pages = JSON.parse(JSON.stringify(state.diagnosisRoutes)), newPage = [];
        for (let n in pages) {
            pages[n].title = i18n.t("diagnosis." + pages[n].title)
            if (pageHideCheck_tool(pages[n].show) || pages[n].show === true) {
                newPage.push(pages[n])
            }
        }
        return newPage;
    },
}
const mutations = {}
const actions = {}
export default { state, getters, mutations, actions }