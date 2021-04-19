import { i18n } from '../i18n'
export const Validate = {
    checkNull: (rule, value, callback) => {
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        } else {
            callback();
        }
    },
    Ssid: (rule, value, callback) => {
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        } else if (value.length < 4 || value.length > 32 || /\s/.test(value)) {
            callback(new Error(i18n.t('tips.formatError')));
        } else {
            callback();
        }
    },
    //wifi 密码
    WifiPwd: (rule, value, callback) => {
        const reg1 = /^[0-9a-zA-Z!*#:\(\)\+\-\.\/%=\?@\^_\{|\}~\x20]{8,32}$/;
        const reg_cn = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        } else if (/\s/.test(value) || reg_cn.test(value) || !reg1.test(value)) {
            callback(new Error(i18n.t('tips.formatError')));
        } else {
            callback();
        }
    },
    //校验范围
    checkRange: (value, arr, callback) => {
        if (!value) {
            return callback(new Error(i18n.t("tips.empty")));
        }
        if (!Number.isInteger(Number(value))) {
            return callback(new Error(i18n.t("tips.integer")));
        }
        if (/\s/.test(value) || Number(value) < arr[0] || Number(value) > arr[1]) {
            callback(new Error(i18n.t("tips.formatError")));
        } else {
            callback();
        }
    },
    //校验长度
    checkLen: (value, arr, callback) => {
        if (!value) {
            return callback(new Error(i18n.t("tips.empty")));
        }
        if (!Number.isInteger(Number(value))) {
            return callback(new Error(i18n.t("tips.integer")));
        }
        if (/\s/.test(value) || value.length < arr[0] || value.length > arr[1]) {
            callback(new Error(i18n.t("tips.formatError")));
        } else {
            callback();
        }
    },
    //ip
    checkIP: (rule, value, callback) => {
        const arr = ['vice_dns', 'sec_dns'];//该名字的字段不校验空
        if (arr.indexOf(rule.field) != -1 && !value) {
            return callback();
        }
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        }
        const reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if ((reg.test(value) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256))) {
            callback();
        } else {
            callback(new Error(i18n.t('tips.formatError')));
        }
    },
    //ipv6
    checkIPv6: (rule, value, callback) => {
        const arr = ['IPv6_sec_dns'];//该名字的字段不校验空
        if (arr.indexOf(rule.field) != -1 && !value) {
            return callback();
        }
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        }
        let regTest = /:/.test(value)
            && value.match(/:/g).length < 8
            && /::/.test(value)
            ? (value.match(/::/g).length == 1
                && /^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i.test(value))
            : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(value);
        if (regTest) {
            callback();
        } else {
            callback(new Error(i18n.t('tips.formatError')));
        }
    },
    //ipv6
    checkIPv6_prefix: (rule, value, callback) => {
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        }
        let valArr = value.split('/')
        let reg = /:/.test(valArr[0])
            && valArr[0].match(/:/g).length < 8
            && /::/.test(valArr[0])
            ? (valArr[0].match(/::/g).length == 1
                && /^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i.test(valArr[0]))
            : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(valArr[0]);
        let reg1 = valArr[1] >= 1 && valArr[1] <= 128
        if (reg && reg1) {
            callback();
        } else {
            callback(new Error(i18n.t('tips.formatError')));
        }
    },
    //port
    checkPort: (rule, value, callback) => {
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        }
        value = Number(value)
        if (!Number.isInteger(value)) {
            callback(new Error(i18n.t('tips.integer')));
        } else if (/\s/.test(value) || value < 1 || value > 65535) {
            callback(new Error(i18n.t('tips.formatError')));
        } else {
            callback();
        }
    },
    //mac
    checkMac: (rule, value, callback) => {
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        }
        const reg = /^([0-9a-f]{2}[\:|\-]){5}[0-9a-f]{2}$/i;
        if (!reg.test(value)) {
            callback(new Error(i18n.t('tips.formatError')));
        } else {
            callback();
        }
    },
    //url
    checkUrl: (rule, value, callback) => {
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        }
        const strRegex = /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/
        const strRegex_ip = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (strRegex.test(value) || strRegex_ip.test(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('tips.formatError')));
        }
    },
    //子网掩码
    checkNetMask: (rule, value, callback) => {
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        }
        const reg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
        if (reg.test(value) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)) {
            callback();
        } else {
            callback(new Error(i18n.t('tips.formatError')));
        }
    },
    //网页登录密码
    checkSysPass: (rule, value, callback) => {
        if (!value) {
            return callback(new Error(i18n.t('tips.empty')));
        }
        const reg = /(?=.*[0-9]).{8,30}$/;
        const reg1 = /(?=.*[a-zA-Z]).{8,30}$/;
        const reg2 = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
        if (reg.test(value) && reg1.test(value) && reg2.test(value) && !/\s/.test(value)) {
            callback();
        } else {
            callback(new Error(i18n.t('tips.passErr')));
        }
    },
    //wpspin码校验
    wpsPinCheck: (code, callback) => {
        let accum = 0;
        accum += 3 * (parseInt(code / 10000000) % 10);
        accum += 1 * (parseInt(code / 1000000) % 10);
        accum += 3 * (parseInt(code / 100000) % 10);
        accum += 1 * (parseInt(code / 10000) % 10);
        accum += 3 * (parseInt(code / 1000) % 10);
        accum += 1 * (parseInt(code / 100) % 10);
        accum += 3 * (parseInt(code / 10) % 10);
        accum += 1 * (parseInt(code / 1) % 10);
        if (0 == accum % 10) {
            callback()
        } else {
            callback(new Error(i18n.t('tips.passErr')));
        }
    }
}
function to8Bit(number) {
    let result = parseInt(number).toString(2);
    while (result.length < 8) {
        result = "0" + result;
    }
    return result;
}

function checkIp(w, y, i) {
    let ws = w.split('.');
    let ys = y.split('.');
    let is = i.split('.');
    for (let index in ws) {
        let cw = to8Bit(ws[index]);
        let cy = to8Bit(ys[index]);
        let ci = to8Bit(is[index]);
        for (let jndex = 0; jndex < 8; jndex++) {
            if (cy[jndex] == "1") {
                if (cw[jndex] != ci[jndex]) return false;
            }
        }
    }
    return true;
}
