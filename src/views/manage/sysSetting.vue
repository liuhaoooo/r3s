<template>
  <div>
    <headerInfo :labelText="$t('help.title20')" :spanText="$t('help.details20')" />
    <a-row type="flex" justify="start">
      <a-col :span="6" :offset="1">
        <div class="sysSetting-item">
          <label for="">锁网开关：</label>
          <div>
            <a-switch v-model="networkLock" @change="postData_networkLock" />
          </div>
        </div>
        <div class="sysSetting-item">
          <label for="">模块LOG开关：</label>
          <div>
            <a-switch v-model="modemLogSwitch" @change="postData_modeLog" />
          </div>
        </div>
        <div class="sysSetting-item">
          <label for="">导出日志：</label>
          <a-button size="small" type="primary" @click="exportLog"
            >导出日志</a-button
          >
          <a
            href="/logs_backup.tar.gz.encode"
            ref="export_log"
            download="logs_backup.tar.gz.encode"
            v-show="false"
          ></a>
        </div>
        <div class="sysSetting-item">
          <label for="">导入配置：</label>
          <a-upload
            :multiple="false"
            action=""
            @change="handleChange"
            :file-list="fileList"
            :before-upload="() => false"
          >
            <a-button size="small" type="primary">选择文件</a-button>
          </a-upload>
          <a-button 
            size="small" 
            type="primary" 
            :disabled="fileList.length == 0" 
            style="margin-left:10px" 
            @click="upload">导入配置</a-button>
        </div>
      </a-col>
      <a-col :span="6" :offset="4">
        <div class="sysSetting-item">
          <label for="">Telnet：</label>
          <div>
            <a-switch v-model="telnet" @change="postData_server" />
          </div>
        </div>
        <div class="sysSetting-item">
          <label for="">ssh：</label>
          <div><a-switch v-model="ssh" @change="postData_server" /></div>
        </div>
        <div class="sysSetting-item">
          <label for="">导出配置：</label>
          <a-button size="small" type="primary" @click="exportConfig"
            >导出配置</a-button
          >
          <a
            href="/cfg_export_config_file.conf"
            ref="export_config"
            download="cfg_export_config_file.conf"
            v-show="false"
          ></a>
        </div>
        <div class="sysSetting-item">
          <label for="">配置升级：</label>
          <a-upload
            :multiple="false"
            action=""
            :remove="handleRemove"
            @change="handleChange_config"
            :file-list="fileList_config"
            :before-upload="() => false"
          >
            <a-button size="small" type="primary">选择文件</a-button>
          </a-upload>
          <a-button 
            v-if="!readyconfigUpdate"
            :disabled="fileList_config.length == 0" 
            size="small" 
            type="primary" 
            style="margin-left:10px" 
            @click="upload_config">上传文件</a-button>
          <a-button 
            v-else
            size="small" 
            type="primary" 
            style="margin-left:10px" 
            @click="update_config">升级配置</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import store from "../../store";
import headerInfo from "../../components/headerInfo.vue";
export default {
  components: {
    headerInfo,
  },
  data() {
    return {
      telnet: false,
      ssh: false,
      networkLock: false,
      modemLogSwitch: false,
      exportUrl: "",
      //导入配置
      file: null,
      fileList: [],
      fileSize: 0,
      //配置升级
      file_config: null,
      fileList_config: [],
      fileSize_config: 0,
      readyconfigUpdate:false,
    };
  },
  mounted() {
    this.getData_server();
    this.getData_networkLock();
    this.getData_modeLog();
  },
  methods: {
    //server
    async getData_server() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.SYS_SERVICE_SET,
      });
      this.telnet = res.telnet == "1";
      this.ssh = res.ssh == "1";
    },
    postData_server() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post({
        cmd: this.$CMD.SYS_SERVICE_SET,
        telnet: this.telnet ? "1" : "0",
        ssh: this.ssh ? "1" : "0",
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    //锁网
    async getData_networkLock() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.NETLOCK,
      });
      this.networkLock = res.networkLock == "Yes";
    },
    postData_networkLock() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post({
        cmd: this.$CMD.NETLOCK,
        networkLock: this.networkLock ? "Yes" : "No",
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    //模块log开关
    async getData_modeLog() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.MODEM_LOG_SWITCH,
      });
      this.modemLogSwitch = res.modemLogSwitch == "1";
    },
    postData_modeLog() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post({
        cmd: this.$CMD.MODEM_LOG_SWITCH,
        modemLogSwitch: this.modemLogSwitch ? "1" : "0",
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    //配置导出
    exportConfig() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_get({
        cmd: this.$CMD.CONFIG_EXPORT,
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$refs.export_config.click();
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    //导入配置
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        this.file = info.file;
        this.fileSize = (this.file.size / (1024 * 1024)).toFixed(2);
      }
      let fileList = [...info.fileList];
      fileList = fileList.slice(-2);
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.fileList = fileList;
    },
    upload(e) {
      e.preventDefault();
      this.$loading_tool({
        loading: true,
        progress: true,
        progressTime: this.fileSize * 0.8,
        text: this.$t("manage.uploading"),
      });
      let fd = new FormData();
      if (this.file == null) return;
      fd.append("file", this.file);
      let options = {
        cmd: this.$CMD.SYS_UPDATE,
      };
      this.$axiosRequest_upload(fd, options).then(async (res) => {
        this.$loading_tool({ loading: false, progress: true });
        if (res.success) {
          this.fileList = [];
          await this.$axiosRequest_get({
            cmd: this.$CMD.CONFIG_LOADER,
            configFile: this.file.name,
          });
          this.$message.success(this.$t("tips.uploadSuccess"));
        } else {
          this.$message.error(this.$t("tips.uploadFail"));
        }
      });
    },
    //导出日志
    exportLog() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_get({
        cmd: this.$CMD.EXPORT_LOG,
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$refs.export_log.click();
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
    //配置升级
    handleChange_config(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        this.file_config = info.file;
        this.fileSize_config = (this.file_config.size / (1024 * 1024)).toFixed(2);
      }
      let fileList = [...info.fileList];
      fileList = fileList.slice(-2);
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.fileList_config = fileList;
    },
    upload_config(e) {
      e.preventDefault();
      this.$loading_tool({
        loading: true,
        progress: true,
        progressTime: this.fileSize_config * 0.8,
        text: this.$t("manage.uploading"),
      });
      let fd = new FormData();
      if (this.file_config == null) return;
      fd.append("file", this.file_config);
      let options = {
        cmd: this.$CMD.SYS_UPDATE,
      };
      this.$axiosRequest_upload(fd, options).then((res) => {
        this.$loading_tool({ loading: false, progress: true });
        if (res.success) {
          this.readyconfigUpdate = true
          this.$message.success(this.$t("tips.uploadSuccess"));
        } else {
          this.$message.error(this.$t("tips.uploadFail"));
        }
      });
    },
    update_config() {
      const _this = this;
      this.$confirm({
        title: _this.$t("manage.isUpdate"),
        width: "350px",
        centered: true,
        okText: _this.$t("tips.ok"),
        cancelText: _this.$t("tips.cancel"),
        onOk() {
          _this.update_config_fn();
          _this.readyconfigUpdate = false
        },
      });
    },
    update_config_fn() {
      let json = {
        cmd: this.$CMD.CONFIG_UPDATE,
        fileName: this.file_config.name,
        isZip: /\.zip$/.test(this.file_config.name),
      };
      this.$loading_tool({
        loading: true,
        text: this.$t("manage.updateing"),
      });
      this.$axiosRequest_post(json).then(()=>{
        store.commit('sysStatus/setNeedRedirect',true)
      });
    },
    handleRemove(file) {
      this.readyconfigUpdate = false
    },
  },
};
</script>