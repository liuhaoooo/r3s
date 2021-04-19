<template>
  <div>
    <headerInfo
      :labelText="$t('help.title18')"
      :spanText="$t('help.details18')"
    />
    <div>
      <a-steps :current="current">
        <a-step :title="$t('manage.updateFile')" />
        <a-step :title="$t('manage.uploadFile')" />
        <a-step :title="$t('manage.update')" />
      </a-steps>
      <div class="steps-content">
        <a-upload-dragger
          name="file"
          :multiple="false"
          action=""
          @change="handleChange"
          :before-upload="() => false"
          :disabled="current != 0"
          :fileList="fileList"
          accept=".pac,.bin,.img"
          @reject="uploadReject"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">{{ $t("manage.tips") }}</p>
        </a-upload-dragger>
      </div>
      <div class="steps-action">
        <a-button v-if="current == 1" type="primary" @click="upload">{{
          $t("manage.upload")
        }}</a-button>
        <a-button v-if="current == 2" type="primary" @click="update">{{
          $t("manage.update")
        }}</a-button>
        <a-button v-if="current > 0" style="margin-left: 100px" @click="prev">{{
          $t("manage.back")
        }}</a-button>
      </div>
    </div>
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
      current: 0,
      file: null,
      fileList: [],
      fileSize: 0,
    };
  },
  methods: {
    prev() {
      if (this.current == 1) {
        this.fileList = [];
        this.file = null;
      }
      this.current--;
    },
    uploadReject() {
      this.$message.error(this.$t("tips.fileFormatError"));
    },
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        this.file = info.file;
        this.fileSize = (this.file.size / (1024 * 1024)).toFixed(2);
        this.current = 1;
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
    upload() {
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
      this.$axiosRequest_upload(fd, options).then((res) => {
        this.$loading_tool({ loading: false, progress: true });
        if (res.success) {
          this.$message.success(this.$t("tips.uploadSuccess"));
          this.current = 2;
        } else {
          this.$message.error(this.$t("tips.uploadFail"));
        }
      });
    },
    update() {
      const _this = this;
      this.$confirm({
        title: _this.$t("manage.isUpdate"),
        width: "350px",
        centered: true,
        okText: _this.$t("tips.ok"),
        cancelText: _this.$t("tips.cancel"),
        onOk() {
          _this.update_fn();
        },
      });
    },
    update_fn() {
      this.$loading_tool({
        loading: true,
        text: this.$t("manage.updateing"),
      });
      let json = {
        cmd: this.$CMD.UPDATE_PARTIAL,
        updateType: "CLIENT",
        fileName: this.file.name,
      };
      this.$axiosRequest_post(json).then(()=>{
        store.commit('sysStatus/setNeedRedirect',true)
      });
    },
  },
};
</script>
