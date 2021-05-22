<template>
  <div>
    <headerInfo
      :labelText="$t('help.title17')"
      :spanText="$t('help.details17')"
    />
    <!-- 添加删除 -->
    <div class="tab_filter">
      <a-button type="dashed" icon="plus" @click="clickAdd">
        {{ $t("firewall.addRule") }}
      </a-button>
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
      <a-form-model
        ref="Form"
        :model="FormData"
        :rules="rules"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="IPv4/IPv6" prop="ippro">
          <a-radio-group v-model="FormData.ippro">
            <a-radio value="IPV4"> IPV4 </a-radio>
            <a-radio value="IPV6"> IPV6 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="过滤模式" prop="enableLink">
          <a-radio-group v-model="FormData.enableLink">
            <a-radio value="1"> {{ $t("firewall.allow") }} </a-radio>
            <a-radio value="0"> {{ $t("firewall.prohibit") }} </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.protocol')" prop="protocol">
          <a-radio-group v-model="FormData.protocol">
            <a-radio value="all"> all </a-radio>
            <a-radio value="tcp"> tcp </a-radio>
            <a-radio value="udp"> udp </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.srcIp')" prop="srcIp">
          <a-input v-model="FormData.srcIp" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.destIp')" prop="destIp">
          <a-input v-model="FormData.destIp" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.remark')" prop="remark">
          <a-input v-model="FormData.remark" type="textarea" :maxLength="80" />
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
      <template
        v-for="col in ['srcIp', 'destIp', 'remark']"
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
      <template slot="enableLink" slot-scope="text, record">
        <div>
          <a-select
            :value="text"
            size="small"
            v-if="record.editable"
            style="margin: -5px 0"
            @change="(value) => handleChange(value, record.key, 'enableLink')"
          >
            <a-select-option value="1">
              {{ $t("firewall.allow") }}
            </a-select-option>
            <a-select-option value="0">
              {{ $t("firewall.prohibit") }}
            </a-select-option>
          </a-select>
          <span v-else>
            {{ text == "1" ? $t("firewall.allow") : $t("firewall.prohibit") }}
          </span>
        </div>
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
import { columns } from "./filter.js";
import { Validate } from "../../config/formValidate.js";
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      Validate,
      data: [], //最终渲染到表单的数据
      cacheData: [], //表单缓存数据
      columns: columns.acl,
      editingKey: "",
      visible: false, //控制添加框显示隐藏
      FormData: {
        enableLink: "1",
        protocol: "all",
        ippro: "IPV4",
        srcIp: "",
        destIp: "",
        remark: "",
      },
      // rules: {
      //   srcIp: [{ validator: Validate.checkIP }],
      //   destIp: [{ validator: Validate.checkIP }],
      // },
    };
  },
  computed: {
    rules() {
      let rules = {
        srcIp: [
          {
            validator:
              this.FormData.ippro == "IPV4"
                ? Validate.checkIP
                : Validate.checkIPv6
          },
        ],
        destIp: [
          {
            validator:
              this.FormData.ippro == "IPV4"
                ? Validate.checkIP
                : Validate.checkIPv6
          },
        ],
      };
      return rules;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.FIRWALL_ACL_FILTER,
        getfun: true,
      });
      if ("datas" in res) {
        for (let i = 0; i < res.datas.length; i++) {
          res.datas[i].enableLink = res.datas[i].enableLink ? "1" : "0";
          res.datas[i].key = i;
        }
        this.data = res.datas;
        this.cacheData = this.data.map((item) => ({ ...item }));
      }
    },
    postData() {
      let datas = JSON.parse(JSON.stringify(this.data));
      for (let i in datas) {
        datas[i].enableLink = datas[i].enableLink == "1";
        delete datas[i].key;
      }
      this.$axiosRequest_post({
        cmd: this.$CMD.FIRWALL_ACL_FILTER,
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
      let error_srcIp = false,
        error_destIp = false;
      if (target.ippro == "IPV4") {
        Validate.checkIP("", target.srcIp, (e) => {
          error_srcIp = e != undefined;
        });
        Validate.checkIP("", target.destIp, (e) => {
          error_destIp = e != undefined;
        });
      } else {
        Validate.checkIPv6("", target.srcIp, (e) => {
          error_srcIp = e != undefined;
        });
        Validate.checkIPv6("", target.destIp, (e) => {
          error_destIp = e != undefined;
        });
      }
      return error_srcIp || error_destIp;
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
          item.protocol == target.protocol &&
          item.ippro == target.ippro &&
          item.destIp == target.destIp &&
          item.srcIp == target.srcIp
      );
      if (
        tmp.length > 0 &&
        (target.protocol != targetCache.protocol ||
          target.ippro != targetCache.ippro ||
          target.destIp != targetCache.destIp ||
          target.srcIp != targetCache.srcIp)
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
              item.protocol == this.FormData.protocol &&
              item.ippro == this.FormData.ippro &&
              item.srcIp == this.FormData.srcIp &&
              item.destIp == this.FormData.destIp
          );
          if (tmp.length > 0) {
            this.$message.error(this.$t("tips.repeated"));
            return;
          }
          this.FormData.key = Number(this.data.length);
          this.FormData.enableRule = true;
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