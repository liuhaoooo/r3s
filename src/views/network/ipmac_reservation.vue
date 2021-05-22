<template>
  <div>
    <headerInfo
      :labelText="$t('help.title4')"
      :spanText="$t('help.details4')"
    />
    <!-- 添加删除 -->
    <div class="tab_filter">
      <a-button type="dashed" icon="plus" @click="clickAdd"> {{$t('dhcp.add')}} </a-button>
      <div></div>
    </div>
    <!-- 弹窗 -->
    <a-modal
      centered
      v-model="visible"
      :title="$t('dhcp.add')"
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
        <a-form-model-item :label="$t('firewall.ip')" prop="ip">
          <a-input v-model="FormData.ip" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.mac')" prop="mac">
          <a-input v-model="FormData.mac" :maxLength="50"/>
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
      <!-- ip,mac -->
      <template
        v-for="col in ['ip', 'mac']"
        :slot="col"
        slot-scope="text, record"
      >
        <a-input
          :key="col"
          :maxLength="50"
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
  </div>
</template>
<script>
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
import { i18n } from "../../i18n";
const columns = [
  {
    title: i18n.t("firewall.ip"),
    dataIndex: "ip",
    ellipsis: true,
    scopedSlots: { customRender: "ip" },
  },
  {
    title: i18n.t("firewall.mac"),
    dataIndex: "mac",
    ellipsis: true,
    scopedSlots: { customRender: "mac" },
  },
  {
    title: i18n.t("firewall.operation"),
    width: 110,
    className: 'column-center-th column-center-td',
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  components: {
    headerInfo,
  },
  data() {
    const checkIP = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("tips.empty")));
      }
      if (value == this.lanIp) {
        callback(new Error(this.$t("dhcp.lanIpSame")));
      }
      const reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (
        reg.test(value) &&
        RegExp.$1 < 256 &&
        RegExp.$2 < 256 &&
        RegExp.$3 < 256 &&
        RegExp.$4 < 256
      ) {
        callback();
      } else {
        callback(new Error(this.$t("tips.formatError")));
      }
    };
    return {
      lanIp: "",
      Validate,
      data: [], //最终渲染到表单的数据
      cacheData: [], //表单缓存数据
      columns,
      editingKey: "",
      visible: false, //控制添加框显示隐藏
      FormData: {
        ip: "",
        mac: "",
      },
      rules: {
        ip: [{ validator: checkIP }],
        mac: [{ validator: Validate.checkMac }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let res_lan = await this.$axiosRequest_get({
        cmd: this.$CMD.NETWORK_CONFIG,
      });
      let res = await this.$axiosRequest_get({ cmd: this.$CMD.STATIC_LEASE });
      this.lanIp = res_lan.lanIp;
      if ("datas" in res) {
        for (let i = 0; i < res.datas.length; i++) {
          res.datas[i].key = i;
        }
        this.data = res.datas;
        this.cacheData = this.data.map((item) => ({ ...item }));
      }
    },
    postData() {
      let datas = JSON.parse(JSON.stringify(this.data));
      for (let i in datas) {
        delete datas[i].key;
      }
      this.$axiosRequest_post({
        cmd: this.$CMD.STATIC_LEASE,
        success: true,
        datas,
      }).then((res) => {
        this.$loading_tool({ loading: false });
        this.getData();
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
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
    // 保存修改
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0]; //修改后
      const targetCache = newCacheData.filter((item) => key === item.key)[0]; //修改前
      let error_ip = false,
        error_mac = false;
      Validate.checkIP("", target.ip, (e) => {
        error_ip = e != undefined;
      });
      Validate.checkMac("", target.mac, (e) => {
        error_mac = e != undefined;
      });
      if (error_ip || error_mac) {
        this.$message.error(this.$t("tips.formatError"));
        return;
      }
      let tmp = newCacheData.filter(
        (item) => item.ip == target.ip && item.mac == target.mac
      );
      if (
        tmp.length > 0 &&
        (target.ip != targetCache.ip || target.mac != targetCache.mac)
      ) {
        this.$message.error(this.$t("tips.repeated"));
        return;
      }
      if (target.ip == this.lanIp) {
        this.$message.error(this.$t("dhcp.lanIpSame"));
        return
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
              item.ip == this.FormData.ip && item.mac == this.FormData.mac
          );
          if (tmp.length > 0) {
            this.$message.error(this.$t("tips.repeated"));
            return;
          }
          this.FormData.key = Number(this.data.length);
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