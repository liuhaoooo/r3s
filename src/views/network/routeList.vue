<template>
  <div>
    <headerInfo
      :labelText="$t('help.title10')"
      :spanText="$t('help.details10')"
    />
    <!-- 添加删除 -->
    <div class="tab_filter">
      <a-button
        type="dashed"
        icon="plus"
        @click="clickAdd"
        :disabled="isBradge_Relay"
      >
        {{ $t("route.add") }}
      </a-button>
      <a-button
        type="dashed"
        icon="delete"
        :disabled="data.length == 0 || isBradge_Relay"
        @click="deleteAll"
      >
        {{ $t("route.clearAll") }}
      </a-button>
    </div>
    <!-- 弹窗 -->
    <a-modal
      centered
      v-model="visible"
      :title="$t('route.add')"
      :okText="$t('tips.ok')"
      :cancelText="$t('tips.cancel')"
      @ok="addRuleSave"
      @cancel="clearForm"
      :closable="false"
      :maskClosable="false"
    >
      <a-form-model
        ref="Form"
        :model="FormData"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item :label="$t('route.ifName')" prop="ifName">
          <a-radio-group v-model="FormData.ifName">
            <a-radio value="WAN"> WAN </a-radio>
            <a-radio value="LAN"> LAN </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('route.ip')" prop="ip">
          <a-input v-model="FormData.ip" />
        </a-form-model-item>
        <a-form-model-item :label="$t('route.netmask')" prop="netmask">
          <a-input v-model="FormData.netmask" />
        </a-form-model-item>
        <a-form-model-item :label="$t('route.gateway')" prop="gateway">
          <a-input v-model="FormData.gateway" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="data"
      bordered
      :pagination="{ pageSize: 5 }"
      v-show="!isBradge_Relay"
    >
      <!-- 开关 -->
      <template slot="valid" slot-scope="text, record">
        <a-switch size="small" v-model="record.valid" @change="switchChange" />
      </template>
      <!-- 版本 -->
      <template slot="ifName" slot-scope="text, record">
        <div>
          <a-select
            :value="text"
            size="small"
            v-if="record.editable"
            style="margin: -5px 0"
            @change="(value) => handleChange(value, record.key, 'ifName')"
          >
            <a-select-option value="WAN">WAN</a-select-option>
            <a-select-option value="LAN">LAN</a-select-option>
          </a-select>
          <span v-else>
            {{ text }}
          </span>
        </div>
      </template>
      <template
        v-for="col in ['ip', 'gateway', 'netmask']"
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
    <!-- 桥接中继模式 -->
    <emptyBradgeRelay />
  </div>
</template>
<script>
import store from "../../store";
import headerInfo from "../../components/headerInfo.vue";
import emptyBradgeRelay from "../../components/empty_BradgeRelay.vue";
import { Validate } from "../../config/formValidate.js";
import { i18n } from "../../i18n";
const columns = [
  {
    title: i18n.t("route.status"),
    dataIndex: "valid",
    width: 70,
    className: 'column-center-th column-center-td',
    scopedSlots: { customRender: "valid" },
  },
  {
    title: i18n.t("route.ifName"),
    dataIndex: "ifName",
    ellipsis: true,
    width: 90,
    className: 'column-center-th column-center-td',
    scopedSlots: { customRender: "ifName" },
  },
  {
    title: i18n.t("route.ip"),
    dataIndex: "ip",
    ellipsis: true,
    scopedSlots: { customRender: "ip" },
  },
  {
    title: i18n.t("route.netmask"),
    dataIndex: "netmask",
    ellipsis: true,
    scopedSlots: { customRender: "netmask" },
  },
  {
    title: i18n.t("route.gateway"),
    dataIndex: "gateway",
    ellipsis: true,
    scopedSlots: { customRender: "gateway" },
  },
  {
    title: i18n.t("route.operation"),
    width: 110,
    className: 'column-center-th column-center-td',
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  components: {
    headerInfo,
    emptyBradgeRelay,
  },
  data() {
    return {
      Validate,
      data: [], //最终渲染到表单的数据
      cacheData: [], //表单缓存数据
      columns,
      editingKey: "",
      visible: false, //控制添加框显示隐藏
      FormData: {
        ifName: "WAN",
        ip: "",
        netmask: "",
        gateway: "",
      },
      rules: {
        ip: [{ validator: Validate.checkIP, trigger: "change" }],
        netmask: [{ validator: Validate.checkNetMask, trigger: "change" }],
        gateway: [{ validator: Validate.checkIP, trigger: "change" }],
      },
    };
  },
  computed: {
    isBradge_Relay: () => store.getters["sysStatus/isBradge_Relay"],
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.ROUTER_TABLE,
      });
      if ("datas" in res) {
        for (let i = 0; i < res.datas.length; i++) {
          res.datas[i].key = i;
        }
        this.data = res.datas;
        this.cacheData = this.data.map((item) => ({ ...item }));
      }
    },
    postData() {
      let datas = [...this.data];
      for (let i in datas) {
        datas[i].netmaskBits = 24;
        delete datas[i].key;
      }
      this.$axiosRequest_post({
        cmd: this.$CMD.ROUTER_TABLE,
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
    check(target) {
      let error_ip = false,
        error_gateway = false,
        error_netmask = false;
      Validate.checkIP("", target.ip, (e) => {
        error_ip = e != undefined;
      });
      Validate.checkIP("", target.gateway, (e) => {
        error_gateway = e != undefined;
      });
      Validate.checkNetMask("", target.netmask, (e) => {
        error_netmask = e != undefined;
      });
      return error_ip || error_gateway || error_netmask;
    },
    // 保存修改
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0]; //修改后
      const targetCache = newCacheData.filter((item) => key === item.key)[0]; //修改前
      if (this.check(target)) {
        this.$message.error(this.$t("tips.formatError"));
        return;
      }
      let tmp = newCacheData.filter(
        (item) =>
          item.ip == target.ip &&
          item.ifName == target.ifName &&
          item.gateway == target.gateway &&
          item.netmask == target.netmask
      );
      if (
        tmp.length > 0 &&
        (target.ip != targetCache.ip ||
          target.ifName != targetCache.ifName ||
          target.gateway != targetCache.gateway ||
          target.netmask != targetCache.netmask)
      ) {
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
      this.$refs.Form.validate((valid) => {
        if (valid) {
          const dataSource = [...this.data];
          let tmp = dataSource.filter(
            (item) =>
              item.ip == this.FormData.ip &&
              item.ifName == this.FormData.ifName &&
              item.netmask == this.FormData.netmask &&
              item.gateway == this.FormData.gateway
          );
          if (tmp.length > 0) {
            this.$message.error(this.$t("tips.repeated"));
            return;
          }
          this.FormData.key = Number(this.data.length);
          this.FormData.valid = true;
          this.visible = false;
          this.$loading_tool({ loading: true });
          this.data.push(this.FormData);
          this.postData();
        } else {
          return false;
        }
      });
    },
    clearForm() {
      this.$refs.Form.resetFields();
    },
  },
};
</script>