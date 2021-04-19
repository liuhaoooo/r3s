<template>
  <div>
    <headerInfo
      :labelText="$t('help.title13')"
      :spanText="$t('help.details13')"
    />
    <!-- 黑白名单选择 -->
    <div class="radio_filter">
      <a-radio-group v-model="radioValue" size="large" @change="radioChange">
        <a-radio value="0">{{ $t("firewall.blacklist") }}</a-radio>
        <a-radio value="1">{{ $t("firewall.whitelist") }}</a-radio>
      </a-radio-group>
    </div>
    <!-- 过滤类型切换 -->
    <div class="tab_filter">
      <a-button type="dashed" icon="plus" @click="clickAdd">
        {{ $t("firewall.addRule") }}
      </a-button>
      <a-radio-group
        button-style="solid"
        v-model="ruleType"
        @change="ruleTypeChange"
         v-show="!isBradge_Relay"
      >
        <a-radio-button value="mac" class="tab_wifi_item">
          {{ $t("firewall.macfilter") }}
        </a-radio-button>
        <a-radio-button value="ip" class="tab_wifi_item">
          {{ $t("firewall.ipfilter") }}
        </a-radio-button>
        <a-radio-button value="port" class="tab_wifi_item">
          {{ $t("firewall.portfilter") }}
        </a-radio-button>
      </a-radio-group>
      <a-button
        type="dashed"
        icon="delete"
        :disabled="data.length == 0"
        @click="deleteAll"
      >
        {{ $t("firewall.clearRule") }}
      </a-button>
    </div>
    <!-- 弹窗 -->
    <a-modal
      centered
      v-model="visible"
      :title="$t('firewall.addRule')"
      :okText="$t('tips.ok')"
      :cancelText="$t('tips.cancel')"
      @ok="addRuleSave"
      @cancel="clearForm"
      :closable="false"
      :maskClosable="false"
    >
      <!-- IP -->
      <a-form-model
        v-show="ruleType == 'ip'"
        ref="Form_ip"
        :model="Form_ip"
        :rules="ipRules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="IPv4/IPv6" prop="ippro">
          <a-radio-group v-model="Form_ip.ippro">
            <a-radio value="IPV4"> IPV4 </a-radio>
            <a-radio value="IPV6"> IPV6 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.protocol')" prop="protocol">
          <a-radio-group v-model="Form_ip.protocol">
            <a-radio value="all"> all </a-radio>
            <a-radio value="tcp"> tcp </a-radio>
            <a-radio value="udp"> udp </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.ip')" prop="ip">
          <a-input v-model="Form_ip.ip" />
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.remark')" prop="remark">
          <a-input v-model="Form_ip.remark" type="textarea" :maxLength="80" />
        </a-form-model-item>
      </a-form-model>
      <!-- PORT -->
      <a-form-model
        v-show="ruleType == 'port'"
        ref="Form_port"
        :model="Form_port"
        :rules="{
          port: [{ validator: Validate.checkPort, trigger: 'change' }],
        }"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="IPv4/IPv6" prop="ippro">
          <a-radio-group v-model="Form_port.ippro">
            <a-radio value="IPV4"> IPV4 </a-radio>
            <a-radio value="IPV6"> IPV6 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.protocol')" prop="protocol">
          <a-radio-group v-model="Form_port.protocol">
            <a-radio value="all"> all </a-radio>
            <a-radio value="tcp"> tcp </a-radio>
            <a-radio value="udp"> udp </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.port')" prop="port">
          <a-input v-model="Form_port.port" />
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.remark')" prop="remark">
          <a-input v-model="Form_port.remark" type="textarea" :maxLength="80" />
        </a-form-model-item>
      </a-form-model>
      <!-- MAC -->
      <a-form-model
        v-show="ruleType == 'mac'"
        ref="Form_mac"
        :model="Form_mac"
        :rules="{ mac: [{ validator: Validate.checkMac, trigger: 'change' }] }"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="IPv4/IPv6" prop="ippro">
          <a-radio-group v-model="Form_mac.ippro">
            <a-radio value="IPV4"> IPV4 </a-radio>
            <a-radio value="IPV6"> IPV6 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.mac')" prop="mac">
          <a-input v-model="Form_mac.mac" />
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.remark')" prop="remark">
          <a-input v-model="Form_mac.remark" type="textarea" :maxLength="80" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="data"
      bordered
      :pagination="{ pageSize: 5 }"
    >
      <!-- 开关 -->
      <template slot="enableRule" slot-scope="text, record">
        <a-switch
          size="small"
          v-model="record.enableRule"
          @change="switchChange"
        />
      </template>
      <!-- 版本 -->
      <template slot="ippro" slot-scope="text, record">
        <div>
          <a-select
            :value="text"
            size="small"
            v-if="record.editable"
            style="margin: -5px 0"
            @change="(value) => handleChange(value, record.key, 'ippro')"
          >
            <a-select-option value="IPV4">IPV4</a-select-option>
            <a-select-option value="IPV6">IPV6</a-select-option>
          </a-select>
          <span v-else>
            {{ text }}
          </span>
        </div>
      </template>
      <!-- 协议 -->
      <template slot="protocol" slot-scope="text, record">
        <div>
          <a-select
            :value="text"
            size="small"
            v-if="record.editable"
            style="margin: -5px"
            @change="(value) => handleChange(value, record.key, 'protocol')"
          >
            <a-select-option value="all">all</a-select-option>
            <a-select-option value="tcp">tcp</a-select-option>
            <a-select-option value="udp">udp</a-select-option>
          </a-select>
          <span v-else>
            {{ text }}
          </span>
        </div>
      </template>
      <!-- ip,备注 -->
      <template
        v-for="col in ['ip', 'port', 'mac', 'remark']"
        :slot="col"
        slot-scope="text, record"
      >
        <a-input
          :key="col"
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          size="small"
          @change="(e) => handleChange(e.target.value, record.key, col)"
        />
        <span :key="col" v-else>
          {{ text }}
        </span>
      </template>
      <!-- 过滤模式 -->
      <template slot="enableLink" slot-scope="text">
        <span>
          {{ text ? $t("firewall.allow") : $t("firewall.prohibit") }}
        </span>
      </template>
      <!-- 操作 -->
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">{{ $t("tips.save") }}</a>
            <a style="color: #999" @click="() => cancel(record.key)">{{
              $t("tips.cancel")
            }}</a>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.key)">{{
              $t("tips.edit")
            }}</a>
            <a-popconfirm
              :title="$t('tips.delete')"
              :cancelText="$t('tips.cancel')"
              :okText="$t('tips.ok')"
              @confirm="() => dele(record.key)"
            >
              <a style="color: #ff4d4f" :disabled="editingKey !== ''">{{
                $t("tips.dele")
              }}</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
import store from "../../store";
import headerInfo from "../../components/headerInfo.vue";
import { columns } from "./filter.js";
import { Validate } from "../../config/formValidate.js";
export default {
  components: {
    headerInfo
  },
  data() {
    return {
      Validate,
      data: [], //最终渲染到表单的数据
      ip_data: [],
      port_data: [],
      mac_data: [],
      cacheData: [], //表单缓存数据
      columns: columns.mac,
      editingKey: "",
      radioValue: "0",
      ruleType: "mac",
      visible: false, //控制添加框显示隐藏
      Form_ip: {
        ippro: "IPV4",
        protocol: "all",
        ip: "",
        remark: "",
      },
      Form_port: {
        ippro: "IPV4",
        protocol: "all",
        port: "",
        remark: "",
      },
      Form_mac: {
        ippro: "IPV4",
        mac: "",
        remark: "",
      },
    };
  },
  computed: {
    isBradge_Relay: () => store.getters["sysStatus/isBradge_Relay"],
    ipRules() {
      if (this.Form_ip.ippro == "IPV4") {
        return { ip: [{ validator: Validate.checkIP, trigger: "change" }] };
      } else {
        return { ip: [{ validator: Validate.checkIPv6, trigger: "change" }] };
      }
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    //黑白名单切换
    radioChange(e) {
      const _this = this;
      this.$confirm({
        title: _this.$t("tips.changeFilterType"),
        width: "350px",
        centered: true,
        okText: _this.$t("tips.ok"),
        cancelText: _this.$t("tips.cancel"),
        onOk() {
          _this.changeMode(e);
        },
        onCancel() {
          if (e.target.value == "0") {
            _this.radioValue = "1";
          } else {
            _this.radioValue = "0";
          }
        },
      });
    },
    async changeMode(e) {
      this.$loading_tool({ loading: true });
      let datas = [
        { enableRule: true, acceptAll: e.target.value == "0", ippro: "IPV4" },
        { enableRule: true, acceptAll: e.target.value == "0", ippro: "IPV6" },
      ];
      Promise.all([
        this.$axiosRequest_post({
          cmd: this.$CMD.DEFAULT_FILTER,
          datas,
          success: true,
        }),
        this.$axiosRequest_post({
          cmd: this.$CMD.MAC_DEFAULT_FILTER,
          success: true,
          datas,
        }),
        this.post(this.$CMD.IP_FILTER, "ip_data"),
        this.post(this.$CMD.PORT_FILTER, "port_data"),
        this.post(this.$CMD.MAC_FILTER, "mac_data"),
      ]).then(() => {
        this.apply();
      });
    },
    async post(cmd, type) {
      if (this[type].length > 0) {
        let datas = [...this[type]];
        for (let i in datas) {
          datas[i].enableLink = this.radioValue == "1";
          delete datas[i].key;
        }
        let res = await this.$axiosRequest_post({
          cmd,
          success: true,
          datas,
        });
        return res.success ? Promise.resolve(res) : Promise.reject();
      }
      return Promise.resolve();
    },
    // 过滤类型切换
    ruleTypeChange(e) {
      this.columns = columns[e.target.value];
      this.data = this[`${e.target.value}_data`];
      this.cacheData = this.data.map((item) => ({ ...item }));
    },
    async getData() {
      let res = await this.$axiosRequest_get({ cmd: this.$CMD.DEFAULT_FILTER });
      if ("datas" in res) {
        this.radioValue = res.datas[0].acceptAll ? "0" : "1";
      }
      await this.getRuleData(this.$CMD.IP_FILTER, "ip_data");
      await this.getRuleData(this.$CMD.PORT_FILTER, "port_data");
      await this.getRuleData(this.$CMD.MAC_FILTER, "mac_data");
      this.data = this[`${this.ruleType}_data`];
      this.cacheData = this.data.map((item) => ({ ...item }));
    },
    // 获取过滤规则->tmpData:存放数据的变量
    async getRuleData(cmd, tmpData) {
      let res = await this.$axiosRequest_get({ cmd, getfun: true });
      if ("datas" in res) {
        for (let i = 0; i < res.datas.length; i++) {
          res.datas[i].key = i;
        }
        this[tmpData] = res.datas;
      }
    },
    postData() {
      const cmdArr = {
        ip: this.$CMD.IP_FILTER,
        port: this.$CMD.PORT_FILTER,
        mac: this.$CMD.MAC_FILTER,
      };
      let datas = [...this.data];
      for (let i in datas) {
        delete datas[i].key;
      }
      this.$axiosRequest_post({
        cmd: cmdArr[this.ruleType],
        success: true,
        datas,
      }).then((res) => {
        if (res.success) {
          this.apply();
        } else {
          this.$loading_tool({ loading: false });
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    // 应用
    apply() {
      this.$axiosRequest_post({ cmd: this.$CMD.APPLY_FILTER }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.getData();
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    // 开关
    switchChange() {
      this.$loading_tool({ loading: true });
      this.postData();
    },
    // 修改框变化触发
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    // 点击修改
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    // 单个删除
    dele(key) {
      this.$loading_tool({ loading: true });
      const dataSource = [...this.data];
      this.data = dataSource.filter((item) => item.key !== key);
      this.postData();
    },
    // 清空规则
    deleteAll() {
      const _this = this;
      this.$confirm({
        title: _this.$t("tips.clearAllRule"),
        width: "350px",
        centered: true,
        okText: _this.$t("tips.ok"),
        cancelText: _this.$t("tips.cancel"),
        onOk() {
          _this.$loading_tool({ loading: true });
          _this.data = [];
          _this.postData();
        },
      });
    },
    // 保存修改
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0]; //修改后
      const targetCache = newCacheData.filter((item) => key === item.key)[0]; //修改前
      let tmp = [], //判断是否存在相同项
        tag = false, //判断是否有改动
        error = false; //判断格式
      switch (this.ruleType) {
        case "ip":
          tmp = newCacheData.filter(
            (item) =>
              item.ip == target.ip &&
              item.ippro == target.ippro &&
              item.protocol == target.protocol
          );
          tag =
            target.ip != targetCache.ip ||
            target.ippro != targetCache.ippro ||
            target.protocol != targetCache.protocol;
          if (target.ippro == "IPV4") {
            Validate.checkIP("", target.ip, (e) => {
              error = e != undefined;
            });
          } else {
            Validate.checkIPv6("", target.ip, (e) => {
              error = e != undefined;
            });
          }
          break;
        case "port":
          tmp = newCacheData.filter(
            (item) =>
              item.port == target.port &&
              item.ippro == target.ippro &&
              item.protocol == target.protocol
          );
          tag =
            target.port != targetCache.port ||
            target.ippro != targetCache.ippro ||
            target.protocol != targetCache.protocol;
          Validate.checkPort("", target.port, (e) => {
            error = e != undefined;
          });
          break;
        case "mac":
          tmp = newCacheData.filter(
            (item) => item.mac == target.mac && item.ippro == target.ippro
          );
          tag =
            target.mac != targetCache.mac || target.ippro != targetCache.ippro;
          Validate.checkMac("", target.mac, (e) => {
            error = e != undefined;
          });
          break;
      }
      if (error) {
        this.$message.error(this.$t("tips.formatError"));
        return;
      }
      //当前有重复项并且这条数据被改动
      if (tmp.length > 0 && tag) {
        this.$message.error(this.$t("tips.repeated"));
        return;
      }
      this.$loading_tool({ loading: true });
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
      this.postData();
    },
    // 取消修改
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter((item) => key === item.key)[0]
        );
        delete target.editable;
        this.data = newData;
      }
    },
    clickAdd() {
      this.visible = true;
    },
    addRuleSave() {
      this.$refs[`Form_${this.ruleType}`].validate((valid) => {
        if (valid) {
          const dataSource = [...this.data];
          let tmp = [];
          switch (this.ruleType) {
            case "ip":
              tmp = dataSource.filter(
                (item) =>
                  item.ip == this[`Form_${this.ruleType}`].ip &&
                  item.ippro == this[`Form_${this.ruleType}`].ippro &&
                  item.protocol == this[`Form_${this.ruleType}`].protocol
              );
              break;
            case "port":
              tmp = dataSource.filter(
                (item) =>
                  item.port == this[`Form_${this.ruleType}`].port &&
                  item.ippro == this[`Form_${this.ruleType}`].ippro &&
                  item.protocol == this[`Form_${this.ruleType}`].protocol
              );
              break;
            case "mac":
              tmp = dataSource.filter(
                (item) =>
                  item.mac == this[`Form_${this.ruleType}`].mac &&
                  item.ippro == this[`Form_${this.ruleType}`].ippro
              );
              break;
          }
          if (tmp.length > 0) {
            this.$message.error(this.$t("tips.repeated"));
            return;
          }
          let tmpFormData = this[`Form_${this.ruleType}`];
          tmpFormData.key = Number(this.data.length);
          tmpFormData.enableRule = true;
          tmpFormData.enableLink = this.radioValue == "1";
          this.visible = false;
          this.$loading_tool({ loading: true });
          this.data.push(tmpFormData);
          this.postData();
        } else {
          return false;
        }
      });
    },
    clearForm() {
      this.$refs[`Form_${this.ruleType}`].resetFields();
    },
  },
};
</script>