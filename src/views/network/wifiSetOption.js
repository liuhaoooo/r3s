export const authenticationOption = [
    { value: "0", name: "开放" },
    { value: "2", name: "WPA2-PSK" },
    { value: "3", name: "WPA-PSK/WPA2-PSK" },
    { value: "4", name: "WPA3-PSK" },
    { value: "5", name: "WPA2-PSK/WPA3-PSK" },
];
export const authentication = {
    "0": "开放",
    "2": "WPA2-PSK",
    "3": "WPA-PSK/WPA2-PSK",
    "4": "WPA3-PSK",
    "5": "WPA2-PSK/WPA3-PSK",
};
export const encryptionItem = [
    { name: "TKIP", value: "TKIP" },
    { name: "AES", value: "AES" },
    { name: "TKIP+AES", value: "TKIPAES" },
];
export const bandWidthOption_24 = [
    { name: "20MHz", value: "0" },
    { name: "40MHz", value: "1" },
    { name: "20/40MHz", value: "2" },
];
export const wifiWorkMode_24 = [
    { name: "11b only", value: "0" },
    { name: "11g only", value: "1" },
    { name: "11n only", value: "2" },
    { name: "11b/g", value: "3" },
    { name: "11g/n", value: "4" },
    { name: "11b/n", value: "5" },
    { name: "11b/g/n", value: "6" },
    { name: "11g/n/ax", value: "16" },
];
export const txOption_24 = [
    { name: "100%", value: "100" },
    { name: "75%", value: "75" },
    { name: "50%", value: "50" },
    { name: "35%", value: "35" },
    { name: "15%", value: "15" },
];
//5gadv
export const bandWidthOption_5 = [
    { name: "20MHz", value: "0" },
    { name: "40MHz", value: "1" },
    { name: "80MHz", value: "3" },
    { name: "160MHz", value: "4" },
];
export const wifiWorkMode_5 = [
    { name: "11a only", value: "7" },
    { name: "11n only", value: "8" },
    { name: "11ac only", value: "9" },
    { name: "11a/n", value: "10" },
    { name: "11n/ac", value: "11" },
    { name: "11a/ac", value: "12" },
    { name: "11a/n/ac", value: "13" },
    { name: "11ac/ax", value: "17" },
];
export const txOption_5 = [
    { name: "100%", value: "100" },
    { name: "75%", value: "75" },
    { name: "50%", value: "50" },
    { name: "35%", value: "35" },
    { name: "15%", value: "15" },
];
export const countryCodeOption = [
    { "name": "CHINA", "value": "CN" },
    { "name": "FCC", "value": "FCC" },
    { "name": "US", "value": "US" },
    { "name": "WORLD-WIDE", "value": "WORLD-WIDE" }
]
const channel_2g_default = [
    {
        "name": "Auto",
        "value": "auto"
    },
    {
        "name": "1",
        "value": "1"
    },
    {
        "name": "2",
        "value": "2"
    },
    {
        "name": "3",
        "value": "3"
    },
    {
        "name": "4",
        "value": "4"
    },
    {
        "name": "5",
        "value": "5"
    },
    {
        "name": "6",
        "value": "6"
    },
    {
        "name": "7",
        "value": "7"
    },
    {
        "name": "8",
        "value": "8"
    },
    {
        "name": "9",
        "value": "9"
    },
    {
        "name": "10",
        "value": "10"
    },
    {
        "name": "11",
        "value": "11"
    },
    {
        "name": "12",
        "value": "12"
    },
    {
        "name": "13",
        "value": "13"
    }
]
const channel_5g_default = [
    {
        "name": "Auto",
        "value": "auto"
    },
    {
        "name": "36",
        "value": "36"
    },
    {
        "name": "40",
        "value": "40"
    },
    {
        "name": "44",
        "value": "44"
    },
    {
        "name": "48",
        "value": "48"
    },
    {
        "name": "52",
        "value": "52"
    },
    {
        "name": "56",
        "value": "56"
    },
    {
        "name": "60",
        "value": "60"
    },
    {
        "name": "64",
        "value": "64"
    },
    {
        "name": "149",
        "value": "149"
    },
    {
        "name": "153",
        "value": "153"
    },
    {
        "name": "157",
        "value": "157"
    },
    {
        "name": "161",
        "value": "161"
    }
]
const channel_5g_fcc_world_wide = [
    {
        "name": "Auto",
        "value": "auto"
    },
    {
        "name": "36",
        "value": "36"
    },
    {
        "name": "40",
        "value": "40"
    },
    {
        "name": "44",
        "value": "44"
    },
    {
        "name": "48",
        "value": "48"
    },
    {
        "name": "52",
        "value": "52"
    },
    {
        "name": "56",
        "value": "56"
    },
    {
        "name": "60",
        "value": "60"
    },
    {
        "name": "64",
        "value": "64"
    },
    {
        "name": "100",
        "value": "100"
    },
    {
        "name": "104",
        "value": "104"
    },
    {
        "name": "108",
        "value": "108"
    },
    {
        "name": "112",
        "value": "112"
    },
    {
        "name": "116",
        "value": "116"
    },
    {
        "name": "136",
        "value": "136"
    },
    {
        "name": "140",
        "value": "140"
    },
    {
        "name": "149",
        "value": "149"
    },
    {
        "name": "153",
        "value": "153"
    },
    {
        "name": "157",
        "value": "157"
    },
    {
        "name": "161",
        "value": "161"
    },
    {
        "name": "165",
        "value": "165"
    }
]

export const channelOption_2g = {
    "CN": channel_2g_default,
    "FCC": channel_2g_default,
    "WORLD-WIDE": channel_2g_default
}
export const channelOption_5g = {
    "CN": channel_5g_default,
    "FCC": channel_5g_fcc_world_wide,
    "WORLD-WIDE": channel_5g_fcc_world_wide
}