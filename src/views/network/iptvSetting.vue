<template>
  <div>
    <headerInfo
      :labelText="$t('help.title26')"
      :spanText="$t('help.details26')"
    />
    <div class="content">
      <a-form-model
        ref="Form"
        :model="Form"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 10 }"
      >
        <a-form-model-item :label="$t('iptv.iptv_enable')">
          <a-switch v-model="Form.iptv_enable" style="margin-top: 8px" @change="iptv_enable_change"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('iptv.vlan_tag')">
          <a-radio-group
            v-model="Form.iptv_vlan_tag"
            :disabled="!Form.iptv_enable"
          >
            <a-radio value="untag">untag</a-radio>
            <a-radio value="tag">tag</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('iptv.vlan_set')" prop="iptv_vlan_id">
          <a-input
            :maxLength="10"
            :disabled="!Form.iptv_enable"
            v-model="Form.iptv_vlan_id"
            style="width: 60%; margin-right: 10px"
          />{{$t('iptv.range')}}
        </a-form-model-item>
        <a-form-model-item :label="$t('iptv.band_lan')">
          <div class="iptv-lan">
            <div>
              LAN1&nbsp;<a-switch v-model="Form.iptv_lan1" size="small" :disabled="!Form.iptv_enable"/>
            </div>
            <div>
              LAN2&nbsp;<a-switch v-model="Form.iptv_lan2" size="small" :disabled="!Form.iptv_enable"/>
            </div>
            <div>
              LAN3&nbsp;<a-switch v-model="Form.iptv_lan3" size="small" :disabled="!Form.iptv_enable"/>
            </div>
          </div>
        </a-form-model-item>
      </a-form-model>
      <div class="form-footer">
        <a-button type="primary" @click="submitForm('Form')">{{
          $t("tips.ok")
        }}</a-button>
        <a-button style="margin-left: 20px" @click="getData">{{
          $t("tips.cancel")
        }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
const iptv_vlan_id = (rule, value, callback) => {
  Validate.checkRange(value, [1, 4095], callback);
};
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      Form: {
        iptv_enable: true,
        iptv_vlan_tag: "untag",
        iptv_vlan_id: "",
        iptv_lan1: true,
        iptv_lan2: false,
        iptv_lan3: false,
      },
      rules: {
        iptv_vlan_id: [{ validator: iptv_vlan_id }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.IPTV_SETTING,
      });
      this.Form.iptv_vlan_id = res.iptv_vlan_id;
      this.Form.iptv_vlan_tag = res.iptv_vlan_tag || "untag";
      this.Form.iptv_enable = res.iptv_enable == "1";
      this.Form.iptv_lan1 = res.iptv_lan1 == "on";
      this.Form.iptv_lan2 = res.iptv_lan2 == "on";
      this.Form.iptv_lan3 = res.iptv_lan3 == "on";
    },
    postData() {
      this.$loading_tool({ loading: true });
      let json = {
        cmd: this.$CMD.IPTV_SETTING,
        iptv_vlan_id: this.Form.iptv_vlan_id,
        iptv_vlan_tag: this.Form.iptv_vlan_tag,
        iptv_enable: this.Form.iptv_enable ? "1" : "0",
        iptv_lan1: this.Form.iptv_lan1 ? "on" : "off",
        iptv_lan2: this.Form.iptv_lan2 ? "on" : "off",
        iptv_lan3: this.Form.iptv_lan3 ? "on" : "off",
      };
      this.$axiosRequest_post(json).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    submitForm(formName) {
      if (!this.Form.iptv_enable) {
        this.postData();
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      });
    },
    iptv_enable_change(e){
      !e && this.$refs['Form'].clearValidate()
    },
  },
};
</script>
<style>
.iptv-lan {
  margin-top: 5px;
  display: flex;
}
.iptv-lan > div {
  margin-right: 20px;
}
</style>