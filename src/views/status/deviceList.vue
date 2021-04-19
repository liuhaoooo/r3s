<template>
  <a-table
    style="margin-top: 20px"
    :columns="columns"
    :data-source="data"
    :pagination="{ pageSize: 5 }"
    bordered
  >
    <template slot="accessMode" slot-scope="text">
      {{ accessModeArr[text] }}
    </template>
    <template slot="ipmac" slot-scope="text">
      <span style="color: #16cdab">ip-</span>{{ text.ip }}
      <br />
      <span style="color: #16cdab">mac-</span>{{ text.mac }}
    </template>
    <template slot="speed" slot-scope="text">
      <a-icon type="arrow-up" style="color: #16cdab" />{{
        speed_rate(text.upload_rate)
      }}
      <br />
      <a-icon type="arrow-down" style="color: #16cdab" />{{
        speed_rate(text.download_rate)
      }}
    </template>
    <template
      v-for="col in ['up_limit', 'dow_limit']"
      :slot="col"
      slot-scope="text, record"
    >
      <div :key="col">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>
          {{ text == "" || text == "0" ? $t('deviceList.unlimit') : `${text} kb/s` }}
        </template>
      </div>
    </template>
    <template slot="edit" slot-scope="text, record">
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
        </span>
      </div>
    </template>
    <template slot="ban_network" slot-scope="text, record">
      <a-switch v-model="record.ban_network" @change="switchChange(record)" />
    </template>
  </a-table>
</template>

<script>
import { i18n } from "../../i18n";
const columns = [
  {
    title: i18n.t('deviceList.name'),
    dataIndex: "name",
    width: 110,
    ellipsis: true,
  },
  {
    title: i18n.t('deviceList.accessMode'),
    dataIndex: "accessMode",
    width: 70,
    className: "column-center-td",
    ellipsis: true,
    scopedSlots: { customRender: "accessMode" },
  },
  {
    title: i18n.t('deviceList.ipmac'),
    dataIndex: "ipmac",
    width: 150,
    ellipsis: true,
    scopedSlots: { customRender: "ipmac" },
  },
  {
    title: i18n.t('deviceList.speed'),
    dataIndex: "speed",
    width: 100,
    ellipsis: true,
    scopedSlots: { customRender: "speed" },
  },
  {
    title: i18n.t('deviceList.up_limit'),
    dataIndex: "up_limit",
    className: "column-center-td",
    width: 100,
    scopedSlots: { customRender: "up_limit" },
  },
  {
    title: i18n.t('deviceList.dow_limit'),
    dataIndex: "dow_limit",
    className: "column-center-td",
    width: 100,
    scopedSlots: { customRender: "dow_limit" },
  },
  {
    title: i18n.t('deviceList.edit'),
    dataIndex: "edit",
    width: 85,
    className: "column-center-th column-center-td",
    scopedSlots: { customRender: "edit" },
  },
  {
    title: i18n.t('deviceList.ban_network'),
    dataIndex: "ban_network",
    width: 75,
    className: "column-center-td",
    scopedSlots: { customRender: "ban_network" },
  },
];
const accessModeArr = {
  0: "2.4G",
  1: "5G",
  2: i18n.t('deviceList.wired'),
  3: "mesh",
};
export default {
  data() {
    return {
      data: [],
      cacheData: [],
      columns,
      accessModeArr,
      editingKey: "",
    };
  },
  computed: {
    speed_rate() {
      return function (value) {
        value = Number(value);
        if (value < 0) {
          value = "0 kb/s";
        } else if (value >= 1024) {
          value = (value / 1024).toFixed(2) + " mb/s";
        } else {
          value = value + " kb/s";
        }
        return value;
      };
    },
  },
  mounted() {
    clearTimeout(window.timeoutGetData);
    this.getData();
    this.intervalGetData();
  },
  beforeDestroy() {
    clearTimeout(window.timeoutGetData);
  },
  methods: {
    intervalGetData() {
      window.timeoutGetData = setTimeout(() => {
        this.intervalGetData();
        this.getData();
      }, 5000);
    },
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.TERMINAL_INFO,
      });
      if ("dataList" in res) {
        let datas = [...res.dataList];
        for (let i = 0; i < datas.length; i++) {
          let item = datas[i];
          item.key = i;
          item.ipmac = { mac: item.mac, ip: item.ip };
          item.speed = {
            upload_rate: item.upload_rate,
            download_rate: item.download_rate,
          };
          item.ban_network = item.ban_network == "1";
        }
        this.data = datas;
        this.cacheData = this.data.map((item) => ({ ...item }));
      }
    },
    postData() {
      let rule = JSON.parse(JSON.stringify(this.data));
      // 数据处理
      for (let i in rule) {
        rule[i].index = i.toString();
        rule[i].ban_network = rule[i].ban_network ? "1" : "0";
        delete rule[i].accessMode;
        delete rule[i].ip;
        delete rule[i].ipmac;
        delete rule[i].key;
        delete rule[i].name;
        delete rule[i].speed;
        delete rule[i].upload_rate;
        delete rule[i].download_rate;
      }
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post({
        cmd: this.$CMD.TERMINAL_INFO,
        success: true,
        rule,
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.intervalGetData();
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    switchChange(e) {
      this.postData();
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      clearTimeout(window.timeoutGetData);
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    checkLimit(value) {
      if (value === "") {
        return false;
      }
      if (!Number.isInteger(Number(value))) {
        return true;
      }
      if (/\s/.test(value) || Number(value) < 0 || Number(value) > 999999) {
        return true;
      } else {
        return false;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0];
      const targetCache = newCacheData.filter((item) => key === item.key)[0];
      if (
        this.checkLimit(target.up_limit) ||
        this.checkLimit(target.dow_limit)
      ) {
        this.$message.error(this.$t("tips.formatError"));
        return;
      }
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
      this.postData();
    },
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
      this.intervalGetData();
    },
  },
};
</script>