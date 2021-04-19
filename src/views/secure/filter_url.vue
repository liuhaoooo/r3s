<template>
  <div>
    <headerInfo
      :labelText="$t('help.title14')"
      :spanText="$t('help.details14')"
    />
    <!-- 黑白名单选择 -->
    <div class="radio_filter">
      <a-radio-group v-model="radioValue" size="large" @change="radioChange" :disabled="isBradge_Relay">
        <a-radio value="0">{{$t("firewall.blacklist")}}</a-radio>
        <a-radio value="1">{{$t("firewall.whitelist")}}</a-radio>
      </a-radio-group>
    </div>
    <!-- 添加删除 -->
    <div class="tab_filter">
      <a-button type="dashed" icon="plus" @click="clickAdd" :disabled="isBradge_Relay">
        {{$t("firewall.addRule")}}
      </a-button>
      <a-button
        type="dashed"
        icon="delete"
        :disabled="data.length == 0 || isBradge_Relay"
        @click="deleteAll"
      >
        {{$t("firewall.clearRule")}}
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
        :rules="{ url: [{ validator: Validate.checkUrl, trigger: 'change' }] }"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-model-item label="IPv4/IPv6" prop="ippro">
          <a-radio-group v-model="FormData.ippro">
            <a-radio value="IPV4"> IPV4 </a-radio>
            <a-radio value="IPV6"> IPV6 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('firewall.url')" prop="url">
          <a-input v-model="FormData.url" />
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
      v-show="!isBradge_Relay"
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
      <!-- url,备注 -->
      <template
        v-for="col in ['url', 'remark']"
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
            <a @click="() => save(record.key)">{{$t('tips.save')}}</a>
            <a style="color: #999" @click="() => cancel(record.key)">{{$t('tips.cancel')}}</a>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.key)"
              >{{$t('tips.edit')}}</a
            >
            <a-popconfirm
              :title="$t('tips.delete')"
              :cancelText="$t('tips.cancel')"
              :okText="$t('tips.ok')"
              @confirm="() => dele(record.key)"
            >
              <a style="color: #ff4d4f" :disabled="editingKey !== ''">{{$t('tips.dele')}}</a>
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
import { columns } from "./filter.js";
import { Validate } from "../../config/formValidate.js";
export default {
  components: {
    headerInfo,
    emptyBradgeRelay
  },
  data() {
    return {
      Validate,
      data: [], //最终渲染到表单的数据
      cacheData: [], //表单缓存数据
      columns: columns.url,
      editingKey: "",
      radioValue: "0",
      visible: false, //控制添加框显示隐藏
      FormData: {
        ippro: "IPV4",
        url: "",
        remark: "",
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
          cmd: this.$CMD.URL_DEFAULT_FILTER,
          datas,
          success: true,
        }),
        this.post(),
      ]).then(() => {
        this.apply();
      });
    },
    async post() {
      if (this.data.length > 0) {
        let datas = [...this.data];
        for (let i in datas) {
          datas[i].enableLink = this.radioValue == "1";
          delete datas[i].key;
        }
        let res = await this.$axiosRequest_post({
          cmd: this.$CMD.URL_FILTER,
          success: true,
          datas,
        });
        return res.success ? Promise.resolve(res) : Promise.reject();
      }
      return Promise.resolve();
    },
    async getData() {
      let res_default = await this.$axiosRequest_get({
        cmd: this.$CMD.URL_DEFAULT_FILTER,
      });
      if ("datas" in res_default) {
        this.radioValue = res_default.datas[0].acceptAll ? "0" : "1";
      }
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.URL_FILTER,
        getfun: true,
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
        delete datas[i].key;
      }
      this.$axiosRequest_post({
        cmd: this.$CMD.URL_FILTER,
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
      const target = newData.filter((item) => key === item.key)[0];//修改后
      const targetCache = newCacheData.filter((item) => key === item.key)[0];//修改前
      let error = false
      Validate.checkUrl("",target.url,(e)=>{
        console.log(new Error(e))
        error = e!=undefined
      })
      if (error) {
        this.$message.error(this.$t("tips.formatError"));
        return;
      }
      let tmp = newCacheData.filter(
        (item) => item.url == target.url && item.ippro == target.ippro
      );
      if (tmp.length > 0 && (target.url != targetCache.url || target.ippro != targetCache.ippro)) {
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
              item.url == this.FormData.url && item.ippro == this.FormData.ippro
          );
          if (tmp.length > 0) {
            this.$message.error(this.$t("tips.repeated"));
            return;
          }
          this.FormData.key = Number(this.data.length);
          this.FormData.enableRule = true;
          this.FormData.enableLink = this.radioValue == "1";
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