<template>
  <div>
    <headerInfo
      :labelText="$t('help.title0')"
      :spanText="$t('help.details0')"
    />
    <a-form-model
      ref="Form"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 10 }"
    >
      <a-form-model-item label="连接方式">
        <a-radio-group v-model="linkType" @change="linkTypeChange">
          <a-radio value="linkIP"> IP </a-radio>
          <a-radio value="linkPPP"> PPPOE </a-radio>
          <a-radio value="Bridge"> 桥模式 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="启用桥接模式" v-show="linkType == 'Bridge'">
        <span class="mytext-color">
          设置后，设备将自动切换到桥接模式，接入一根网线到上行端口，即可实现LAN上行上网。
        </span>
      </a-form-model-item>
    </a-form-model>
    <linkTypeIp
      v-show="linkType == 'linkIP'"
      @postData="postData"
      ref="linkTypeIp"
      @cancelClick="getData"
    />
    <linkTypePppoe
      v-show="linkType == 'linkPPP'"
      @postData="postData"
      ref="linkTypePppoe"
      @cancelClick="getData"
    />
    <div class="form-footer" v-show="linkType == 'Bridge'">
      <a-button type="primary" @click="postData_bridge">确定</a-button>
      <a-button style="margin-left: 20px">取消</a-button>
    </div>
  </div>
</template>
<script>
import store from "../../../store";
import headerInfo from "../../../components/headerInfo.vue";
import linkTypeIp from "./linkType_ip.vue";
import linkTypePppoe from "./linkType_pppoe.vue";
export default {
  components: {
    headerInfo,
    linkTypeIp,
    linkTypePppoe,
  },
  data() {
    return {
      linkType: "linkIP",
    };
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    clearInterval(window.getSuccessStatus);
  },
  methods: {
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.BROADBAND_SETTING,
      });
      res.PD_enable = res.PD_enable == "1";
      //默认值处理
      res.IPv6_wan_type = res.IPv6_wan_type || "SLAAC";
      res.protocol_type = res.protocol_type || "IPv4";
      res.wan_type = res.wan_type || "DHCP";
      res.prefix = res.prefix || "Auto";
      res.IPv6_add = res.IPv6_add + "/" + res.IPv6_add_prefix;
      this.linkType = res.linkType || "Bridge";
      this.$refs.linkTypeIp.Form = res;
      this.$refs.linkTypePppoe.Form = res;
    },
    postData(json) {
      if(json.linkType != "Bridge"){
        json.PD_enable = json.PD_enable ? "1" : "0";
        json.IPv6_add_prefix = json.IPv6_add.split("/")[1];
        json.IPv6_add = json.IPv6_add.split("/")[0];
      }
      json.cmd = this.$CMD.BROADBAND_SETTING;
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post(json).then((res) => {
        clearInterval(window.getSuccessStatus)
        if (res.success) {
          store.dispatch("sysStatus/getNetworkInfo");//更新vuex状态
          this.$loading_tool({ loading: false });
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$loading_tool({ loading: false });
          this.$message.error(this.$t("tips.setFail"));
        }
      });
      clearInterval(window.getSuccessStatus)
      window.getSuccessStatus = setInterval(()=>{
        this.getSuccessStatus()
      },3000)
    },
    postData_bridge() {
      let json = {
        linkType: "Bridge",
      };
      this.postData(json);
    },
    linkTypeChange(){
      if(this.linkType == "linkPPP" && this.$refs.linkTypeIp.Form.IPv6_wan_type == "Static"){
        this.$refs.linkTypePppoe.Form.IPv6_wan_type = "SLAAC"
      }
    },
    getSuccessStatus(){
      this.$axiosRequest_get({
        cmd: this.$CMD.GET_DEVICE_NAME,
      }).then(res=>{
        if(res.success){
          clearInterval(window.getSuccessStatus)
          this.$loading_tool({ loading: false });
          this.$message.success(this.$t("tips.setSuccess"));
          store.dispatch("sysStatus/getNetworkInfo");//更新vuex状态
        }
      })
    }
  },
};
</script>