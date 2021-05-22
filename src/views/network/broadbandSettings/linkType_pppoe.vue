<template>
  <div class="content" style="padding-top: 0">
    <a-form-model
      ref="Form"
      :model="Form"
      :rules="rules"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 10 }"
    >
      <a-form-model-item label="IP协议版本">
        <a-radio-group v-model="Form.protocol_type">
          <a-radio value="IPv4">IPv4</a-radio>
          <a-radio value="IPv6">IPv6</a-radio>
          <a-radio value="IPv4/IPv6">IPv4/IPv6</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        label="MTU[128-1492]"
        prop="mtu_pppoe"
        v-if="Form.protocol_type == 'IPv4'"
      >
        <a-input v-model.number="Form.mtu_pppoe" :maxLength="50"/>
      </a-form-model-item>
      <a-form-model-item label="MTU[1280-1492]" prop="mtu_pppoe" v-else>
        <a-input v-model.number="Form.mtu_pppoe" :maxLength="50"/>
      </a-form-model-item>
      <a-form-model-item label="用户名" prop="userName">
        <a-input v-model="Form.userName" :maxLength="32"/>
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password">
        <a-input-password v-model="Form.password" :maxLength="32"/>
      </a-form-model-item>
      <!-- IPv6 ip -->
      <div v-if="Form.protocol_type != 'IPv4'">
        <a-form-model-item label="IPv6 WAN信息获取方式">
          <a-select v-model="Form.IPv6_wan_type">
            <a-select-option value="SLAAC">SLAAC</a-select-option>
            <a-select-option value="DHCP">DHCP</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="IPv6默认网关"
          prop="IPv6_gateway"
          v-if="Form.IPv6_wan_type != 'SLAAC'"
        >
          <a-input v-model="Form.IPv6_gateway" :maxLength="50"/>
        </a-form-model-item>
      </div>
      <!-- pd使能分组 -->
      <div v-if="Form.protocol_type != 'IPv4'">
        <a-form-model-item label="PD使能">
          <a-switch v-model="Form.PD_enable" />
        </a-form-model-item>
        <div v-if="Form.PD_enable">
          <a-form-model-item label="前缀模式">
            <a-radio-group default-value="Auto" v-model="Form.prefix">
              <a-radio value="Auto"> Auto </a-radio>
              <a-radio value="Manual"> Manual </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <div v-if="Form.prefix == 'Manual'">
            <a-form-model-item label="前缀地址" prop="prefix_add">
              <a-input v-model="Form.prefix_add" :maxLength="50"/>
            </a-form-model-item>
            <!-- <a-form-model-item label="首选寿命[600-4294967295]" prop="preferred_life">
              <a-input v-model="Form.preferred_life" :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="有效寿命[600-4294967295]" prop="Effective_life">
              <a-input v-model="Form.Effective_life" :maxLength="50"/>
            </a-form-model-item> -->
          </div>
        </div>
      </div>
    </a-form-model>
    <div class="form-footer">
      <a-button type="primary" @click="submitForm('Form')">确定</a-button>
      <a-button style="margin-left: 20px" @click="resetForm('Form')"
        >取消</a-button
      >
    </div>
  </div>
</template>

<script>
import { Validate } from "../../../config/formValidate.js";
const mtu_ip1 = (rule, value, callback) => {
  Validate.checkRange(value, [128, 1492], callback);
};
const mtu_ip2 = (rule, value, callback) => {
  Validate.checkRange(value, [1280, 1492], callback);
};
const check_preferred = (rule, value, callback) => {
    Validate.checkRange(value, [600, 4294967295], callback);
}
const check_Effective = (rule, value, callback) => {
    Validate.checkRange(value, [600, 4294967295], callback);
}
export default {
  data() {
    return {
      Form: {
        protocol_type: "IPv4", //IP协议版本
        wan_type: "DHCP", //IP获取方式
        mtu_pppoe: "1492",
        userName:"",
        password:"",
        //v6
        IPv6_wan_type: "SLAAC", //IPv6 WAN信息获取方式
        IPv6_gateway: "", //IPv6默认网关
        //PD
        PD_enable: false, //PD使能
        prefix: "Auto", //前缀模式
        prefix_add: "", //前缀地址
        // preferred_life: "", //首选寿命
        // Effective_life: "", //有效寿命
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let json = {...this.Form}
          json.linkType = 'linkPPP'
          this.$emit("postData",json)
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit("cancelClick")
    },
  },
  computed: {
    rules() {
      return {
        userName:[{validator: Validate.normal}],
        password:[{validator: Validate.normal}],
        mtu_pppoe: [{validator: this.Form.protocol_type == "IPv4" ? mtu_ip1 : mtu_ip2}],
        IPv6_gateway:[{validator: Validate.checkIPv6}],
        prefix_add:[{validator: Validate.checkIPv6_prefix}],
        // preferred_life:[{validator: check_preferred}],
        // Effective_life:[{validator: check_Effective}],
      };
    },
  },
};
</script>