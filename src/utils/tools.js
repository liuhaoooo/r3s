import { CMD } from "../config/cmd";
import router from "../router";
import { axiosRequest_post, axiosRequest_get } from "../utils/request";
import store from "../store";
import { Modal, message } from "ant-design-vue";
import { rsaPubKey, rsaPrivateKey } from "../config/config"
import JSEncrypt from 'jsencrypt';
import { i18n } from '../i18n'
// 退出登录
export const logout_tool = title => {
    if (!title) {
        axiosRequest_post({ cmd: CMD.LOGOUT }).then(res => {
            sessionStorage.clear()
            router.push({ name: 'Login' });
        });
        return
    }
    Modal.confirm({
        title,
        width: '350px',
        centered: true,
        okText: i18n.t("tips.ok"),
        cancelText: i18n.t("tips.cancel"),
        onOk() {
            axiosRequest_post({ cmd: CMD.LOGOUT }).then(res => {
                sessionStorage.clear()
                router.push({ name: 'Login' });
            });
        }
    });
}
// 重启
export const restart_tool = title => {
    if (!title) {
        loading_tool({ loading: true, progress: false, text: "正在重启，请勿做其他操作" })
        axiosRequest_post({ cmd: CMD.SYS_REBOOT, rebootType: 2 })
        return
    }
    Modal.confirm({
        title,
        width: '350px',
        centered: true,
        okText: i18n.t("tips.ok"),
        cancelText: i18n.t("tips.cancel"),
        onOk() {
            loading_tool({ loading: true, progress: false, text: "正在重启，请勿做其他操作" })
            axiosRequest_post({ cmd: CMD.SYS_REBOOT, rebootType: 2 })
        }
    });
}
// 恢复出厂
export const reset_tool = title => {
    Modal.confirm({
        title,
        width: '350px',
        centered: true,
        okText: i18n.t("tips.ok"),
        cancelText: i18n.t("tips.cancel"),
        onOk() {
            loading_tool({
                loading: true,
                progress: false,
                progressTime: 20,
                text: "正在恢复出厂，请勿做其他操作",
            })
            axiosRequest_post({ cmd: CMD.RESTORE_DEFAULT }).then(res => {
                if (res.success) {
                    loading_tool({
                        loading: true,
                        progress: false,
                        text: "恢复出厂成功，正在重启",
                    });
                    axiosRequest_post({
                        cmd: CMD.SYS_REBOOT,
                        rebootType: 3,
                    });
                } else {
                    loading_tool({ loading: false });
                    message.error("恢复出厂失败");
                }
            })
        }
    });
}
export const date_tool = val => {
    let day = Math.floor(val / (24 * 3600)) || 0;
    let hour = Math.floor((val - day * 24 * 3600) / 3600) || 0;
    let minute = Math.floor((val - day * 24 * 3600 - hour * 3600) / 60) || 0;
    return ` ${day}天 ${hour}小时 ${minute}分`
}
export const parseHexPageHide_tool = hex => {
    if (!hex) return '00'
    let bits = ["00", "01", "02", "03",
        "10", "11", "12", "13",
        "20", "21", "22", "23",
        "30", "31", "32", "33"];
    let arr = [];
    let length = hex.length;
    for (let i = 0; i < length; i++) {
        arr.push(bits[parseInt(hex.charAt(i), 16)]);
    }
    let str = arr.join("");
    return str;
}
export const pageHideCheck_tool = index => {
    let arr = store.getters['sysStatus/webPageFlag'];
    let level = store.getters['sysStatus/account_level']
    if (arr[index] == "1") {
        if (level == "1" || level == "2") {
            return true;
        } else {
            return false;
        }
    } else if (arr[index] == "2") {
        if (level == "1" || level == "3") {
            return true;
        } else {
            return false;
        }
    } else if (arr[index] == "3") {
        return true;
    } else {
        if (level == "1") {
            return true;
        } else {
            return false;
        }
    }
}
//rsa加密
export const rsaEnc_tool = data => {
    const encryptStr = new JSEncrypt();
    encryptStr.setPublicKey(rsaPubKey);
    let result = encryptStr.encrypt(JSON.stringify(data));
    return result;
}
//rsa解密
export const rsaDec_tool = data => {
    const decrypt = new JSEncrypt()
    decrypt.setPrivateKey(rsaPrivateKey)
    let result = decrypt.decrypt(data)
    result = JSON.parse(result)
    return result
}
/**
 * 
 * @param {
 * loading:控制加载显示隐藏,
 * progress:是否是进度条,
 * progressTime:进度条的速度,
 * text:提示信息
 * } props 
 */
export const loading_tool = (props) => {
    store.commit('loading/setLoading', props.loading || false)
    store.commit('loading/setIsProgress', props.progress || false)
    store.commit('loading/setProgressTime', props.progressTime || 100)
    store.commit('loading/setLoadingText', props.text || '正在保存您的配置,请耐心等待...')
}