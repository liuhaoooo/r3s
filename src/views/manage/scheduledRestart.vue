<template>
  <div>
    <headerInfo
      :labelText="$t('help.title24')"
      :spanText="$t('help.details24')"
    />
    <!-- 添加删除 -->
    <div class="tab_filter">
      <a-button type="dashed" icon="plus" @click="clickAdd">
        {{ $t("route.add") }}
      </a-button>
      <div>
        <label for="">{{$t('manage.sysTime')}}</label>
        <span :style="'color:'+themeColor">{{systime}}</span>
      </div>
      <a-button
        type="dashed"
        icon="delete"
        :disabled="data.length == 0"
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
      <a-form-model ref="Form" :model="FormData" :rules="rules">
        <a-form-model-item prop="open_time">
          <a-time-picker
            :allowClear="false"
            v-model="FormData.open_time"
            :placeholder="$t('tips.selectTime')"
            style="width: 100%"
            format="HH:mm"
            valueFormat="HHmm"
          />
        </a-form-model-item>
        <br />
        <a-form-model-item prop="week_timeArr">
          <a-checkbox-group
            v-model="FormData.week_timeArr"
            :options="plainOptions"
          />
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
      <!-- 状态 -->
      <template slot="timing_switch" slot-scope="text, record">
        <a-switch
          size="small"
          v-model="record.timing_switch"
          @change="switchChange"
        />
      </template>
      <!-- 星期 -->
      <template slot="week_timeArr" slot-scope="text, record">
        <div>
          <a-checkbox-group
            :default-value="text"
            v-if="record.editable"
            :options="plainOptions"
            @change="(e) => handleChange(e, record.key, 'week_timeArr')"
          />
          <span v-else>
            <a-tag :color="themeColor" v-for="(item, i) in text" :key="i">{{
              plainOptions[item].label
            }}</a-tag>
          </span>
        </div>
      </template>
      <!-- 时间 -->
      <template slot="open_time" slot-scope="text, record">
        <div>
          <a-time-picker
            :allowClear="false"
            style="margin: -5px 0; width: 80px"
            :value="text"
            size="small"
            v-if="record.editable"
            format="HH:mm"
            valueFormat="HHmm"
            @change="(e) => handleChange(e, record.key, 'open_time')"
          />
          <span v-else>
            {{ `${text.substring(0, 2)} : ${text.substring(2, 4)}` }}
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
import moment from 'moment';
import { mapActions, mapState, mapGetters } from "vuex";
import headerInfo from "../../components/headerInfo.vue";
import { Validate } from "../../config/formValidate.js";
import { i18n } from "../../i18n";
const columns = [
  {
    title: i18n.t('manage.status'),
    dataIndex: "timing_switch",
    width: 70,
    className: "column-center-th column-center-td",
    scopedSlots: { customRender: "timing_switch" },
  },
  {
    title: i18n.t('manage.RestartTime'),
    colSpan: 2,
    dataIndex: "week_timeArr",
    scopedSlots: { customRender: "week_timeArr" },
  },
  {
    title: "",
    dataIndex: "open_time",
    ellipsis: true,
    colSpan: 0,
    width: 110,
    className: "column-center-td",
    scopedSlots: { customRender: "open_time" },
  },
  {
    title: i18n.t("route.operation"),
    width: 110,
    className: "column-center-th column-center-td",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
const plainOptions = [
  { label: i18n.t('manage.week0'), value: "0" },
  { label: i18n.t('manage.week1'), value: "1" },
  { label: i18n.t('manage.week2'), value: "2" },
  { label: i18n.t('manage.week3'), value: "3" },
  { label: i18n.t('manage.week4'), value: "4" },
  { label: i18n.t('manage.week5'), value: "5" },
  { label: i18n.t('manage.week6'), value: "6" },
];
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      plainOptions,
      Validate,
      data: [], //最终渲染到表单的数据
      cacheData: [], //表单缓存数据
      columns,
      editingKey: "",
      visible: false, //控制添加框显示隐藏
      systime:"",
      FormData: {
        open_time: "0800",
        week_timeArr: ['0'],
      },
      rules: {
        open_time: [{ validator: Validate.checkNull }],
        week_timeArr: [
          {
            type: "array",
            required: true,
            message: i18n.t("tips.empty")
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("sysStatus", {
      themeColor: (state) => state.themeColor,
    }),
  },
  mounted() {
    clearInterval(window.addTimeInterval)
    this.getData();
    this.getTime();
  },
  beforeDestroy() {
    clearInterval(window.addTimeInterval)
  },
  methods: {
    async getTime(){
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.SET_DATETIME,
      });
      this.systime = moment(res.systime, 'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD dddd HH:mm:ss");
      this.addTime(res.systime)
    },
    addTime(systime){
      let i = 0;
      window.addTimeInterval = setInterval(()=>{
        this.systime = moment(systime, 'YYYY-MM-DD HH:mm:ss').add(++i, 's').format("YYYY-MM-DD dddd HH:mm:ss");
      },1000)
    },
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.TIMERESTART,
      });
      if ("data" in res) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].key = i;
          res.data[i].timing_switch = res.data[i].timing_switch == "1";
          res.data[i].week_timeArr = res.data[i].week_time.split("");
        }
        this.data = res.data;
        this.cacheData = this.data.map((item) => ({ ...item }));
      }
    },
    postData() {
      let data = JSON.parse(JSON.stringify(this.data));
      for (let i in data) {
        data[i].timing_switch = data[i].timing_switch ? "1" : "0";
        data[i].week_time = data[i].week_timeArr.join("")
        delete data[i].key;
        delete data[i].week_timeArr;
      }
      this.$axiosRequest_post({
        cmd: this.$CMD.TIMERESTART,
        data,
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
    // 清空所有
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
      let tmp = newCacheData.filter((item) => 
        item.week_timeArr.join("") == target.week_timeArr.join("") && item.open_time == target.open_time
      );
      if(target.week_timeArr.length==0){
        this.$message.error(this.$t("tips.week_empty"));
        return
      }
      if (tmp.length > 0 && (target.week_timeArr.join("") != targetCache.week_timeArr.join("") || target.open_time != targetCache.open_time)) {
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
          let tmp = dataSource.filter((item) =>
              item.week_timeArr.join("") == this.FormData.week_timeArr.join("") &&
              item.open_time == this.FormData.open_time
          );
          if (tmp.length > 0) {
            this.$message.error(this.$t("tips.repeated"));
            return;
          }
          this.FormData.key = Number(this.data.length);
          this.FormData.timing_switch = true;
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