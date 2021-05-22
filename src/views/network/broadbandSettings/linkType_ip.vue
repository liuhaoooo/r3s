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
      <a-form-model-item label="IP获取方式" v-if="Form.protocol_type != 'IPv6'">
        <a-radio-group v-model="Form.wan_type">
          <a-radio value="DHCP">DHCP</a-radio>
          <a-radio value="Static">Static</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        label="MTU[576-1500]"
        prop="mtu_ip"
        v-if="Form.protocol_type == 'IPv4'"
      >
        <a-input v-model="Form.mtu_ip" :maxLength="50"/>
      </a-form-model-item>
      <a-form-model-item label="MTU[1280-1500]" prop="mtu_ip" v-else>
        <a-input v-model="Form.mtu_ip" :maxLength="50"/>
      </a-form-model-item>
      <!-- ipv4 ip -->
      <div v-if="Form.protocol_type != 'IPv6' && Form.wan_type == 'Static'">
        <a-form-model-item label="IP 地址" prop="ipadd_ip">
          <a-input v-model="Form.ipadd_ip" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item label="子网掩码" prop="submask_ip">
          <a-input v-model="Form.submask_ip" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item label="缺省网关" prop="gateway_ip">
          <a-input v-model="Form.gateway_ip" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item label="首选DNS服务器" prop="first_dns">
          <a-input v-model="Form.first_dns" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item label="备用DNS服务器" prop="sec_dns">
          <a-input v-model="Form.sec_dns" :maxLength="50"/>
        </a-form-model-item>
      </div>
      <!-- IPv6 ip -->
      <div v-if="Form.protocol_type != 'IPv4'">
        <a-form-model-item label="IPv6 WAN信息获取方式">
          <a-select v-model="Form.IPv6_wan_type">
            <a-select-option value="SLAAC" :disabled="IPv6_wan_type_disabled"
              >SLAAC</a-select-option
            >
            <a-select-option value="DHCP" :disabled="IPv6_wan_type_disabled"
              >DHCP</a-select-option
            >
            <a-select-option
              value="Static"
              :disabled="IPv6_wan_type_static_disabled"
              >Static</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="IPv6默认网关"
          prop="IPv6_gateway"
          v-if="Form.IPv6_wan_type != 'SLAAC'"
        >
          <a-input v-model="Form.IPv6_gateway" :maxLength="50"/>
        </a-form-model-item>
        <div v-if="Form.IPv6_wan_type == 'Static'">
          <!-- <a-form-model-item label="IPv6地址" prop="IPv6_add">
            <a-input
              v-model="Form.IPv6_add"
              style="width: 200px; margin-right: 10px"
            />
            <span> / </span>
            <a-input
              v-model="Form.IPv6_add_prefix"
              style="width: 80px; margin-left: 10px"
            />
          </a-form-model-item> -->
          <a-form-model-item label="IPv6地址" prop="IPv6_add">
            <a-input v-model="Form.IPv6_add" :maxLength="50"/>
          </a-form-model-item>
          <a-form-model-item label="IPv6首选DNS服务器" prop="IPv6_first_dns">
            <a-input v-model="Form.IPv6_first_dns" :maxLength="50"/>
          </a-form-model-item>
          <a-form-model-item label="IPv6备用DNS服务器" prop="IPv6_sec_dns">
            <a-input v-model="Form.IPv6_sec_dns" :maxLength="50"/>
          </a-form-model-item>
        </div>
      </div>
      <!-- pd使能分组 -->
      <div v-if="Form.protocol_type != 'IPv4'">
        <a-form-model-item label="PD使能">
          <a-switch v-model="Form.PD_enable" />
        </a-form-model-item>
        <div v-if="Form.PD_enable">
          <a-form-model-item label="前缀模式">
            <a-radio-group
              default-value="Auto"
              v-model="Form.prefix"
              :disabled="prefix_disabled"
            >
              <a-radio value="Auto"> Auto </a-radio>
              <a-radio value="Manual"> Manual </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <div v-if="Form.prefix == 'Manual'">
            <a-form-model-item label="前缀地址" prop="prefix_add">
              <a-input v-model="Form.prefix_add" :maxLength="50"/>
            </a-form-model-item>
            <!-- <a-form-model-item
              label="首选寿命[600-4294967295]"
              prop="preferred_life"
            >
              <a-input v-model="Form.preferred_life" :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item
              label="有效寿命[600-4294967295]"
              prop="Effective_life"
            >
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
  Validate.checkRange(value, [576, 1500], callback);
};
const mtu_ip2 = (rule, value, callback) => {
  Validate.checkRange(value, [1280, 1500], callback);
};
const check_preferred = (rule, value, callback) => {
  Validate.checkRange(value, [600, 4294967295], callback);
};
const check_Effective = (rule, value, callback) => {
  Validate.checkRange(value, [600, 4294967295], callback);
};
export default {
  data() {
    return {
      Form: {
        protocol_type: "IPv4", //IP协议版本
        wan_type: "DHCP", //IP获取方式
        mtu_ip: "1500",
        //v4
        ipadd_ip: "", //IP 地址
        submask_ip: "", //子网掩码
        gateway_ip: "", //缺省网关
        first_dns: "", //首选DNS服务器
        sec_dns: "", //备用DNS服务器
        //v6
        IPv6_wan_type: "SLAAC", //IPv6 WAN信息获取方式
        IPv6_add: "", //ipv6 地址  fe80::44d1:b501:da39:fbf7
        // IPv6_add_prefix: "", //1-128
        IPv6_gateway: "", //IPv6默认网关
        IPv6_first_dns: "", //首选DNS服务器:ipv6
        IPv6_sec_dns: "", //备用DNS服务器:ipv6
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
          let json = { ...this.Form };
          json.linkType = "linkIP";
          this.$emit("postData", json);
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit("cancelClick");
    },
  },
  computed: {
    rules() {
      return {
        mtu_ip: [
          {
            validator: this.Form.protocol_type == "IPv4" ? mtu_ip1 : mtu_ip2
          },
        ],
        ipadd_ip: [{ validator: Validate.checkIP }],
        submask_ip: [{ validator: Validate.checkNetMask }],
        gateway_ip: [{ validator: Validate.checkIP }],
        first_dns: [{ validator: Validate.checkIP }],
        sec_dns: [{ validator: Validate.checkIP }],
        IPv6_add: [{ validator: Validate.checkIPv6_prefix }],
        IPv6_gateway: [{ validator: Validate.checkIPv6 }],
        IPv6_first_dns: [{ validator: Validate.checkIPv6 }],
        IPv6_sec_dns: [{ validator: Validate.checkIPv6 }],
        prefix_add: [
          { validator: Validate.checkIPv6_prefix },
        ],
        // preferred_life: [{ validator: check_preferred }],
        // Effective_life: [{ validator: check_Effective }],
      };
    },
    IPv6_wan_type_disabled() {
      return (
        this.Form.wan_type == "Static" && this.Form.protocol_type == "IPv4/IPv6"
      );
    },
    IPv6_wan_type_static_disabled() {
      return (
        !this.IPv6_wan_type_disabled && this.Form.protocol_type == "IPv4/IPv6"
      );
    },
    prefix_disabled() {
      return this.Form.IPv6_wan_type == "Static";
    },
  },
  watch: {
    IPv6_wan_type_disabled() {
      if (this.IPv6_wan_type_disabled) {
        this.Form.IPv6_wan_type = "Static";
      } else {
        this.Form.IPv6_wan_type = "SLAAC";
      }
    },
    IPv6_wan_type_static_disabled() {
      if (this.IPv6_wan_type_static_disabled) {
        this.Form.IPv6_wan_type = "SLAAC";
      }
    },
    prefix_disabled() {
      if (this.prefix_disabled) {
        this.Form.prefix = "Manual";
      }
    },
  },
};
</script>