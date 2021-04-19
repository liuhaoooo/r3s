<template>
  <div>
    <headerInfo
      :labelText="$t('help.title3')"
      :spanText="$t('help.details3')"
    />
    <a-spin :spinning="loading" :indicator="indicator" :tip="$t('tips.sysSetting')">
      <a-form-model layout="inline" class="mesh-header">
        <a-form-model-item :label="$t('mesh.meshEnable')" style="margin-right: 80px">
          <a-switch v-model="mesh_switch" @change="meshSwitchChange" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            type="primary"
            size="small"
            :disabled="!mesh_switch"
            @click="startMesh"
            >{{$t('mesh.startMesh')}}</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <div class="meshMap-content" v-if="!mesh_switch || isRelay">
      <a-empty style="padding-top: 60px;">
        <span slot="description" v-if="isRelay"> {{$t('tips.isRelay')}}</span>
        <span slot="description" v-else> {{$t('tips.mesh_switch')}} </span>
      </a-empty>
    </div>
    <meshMap ref="meshMap" v-else />
  </div>
</template>

<script>
import headerInfo from "../../components/headerInfo.vue";
import meshMap from "./meshMap.vue";
import store from "../../store";
export default {
  components: {
    headerInfo,
    meshMap,
  },
  data() {
    return {
      indicator: (
        <a-icon type="loading-3-quarters" style="font-size: 24px" spin />
      ),
      mesh_switch: false,
      loading: false,
    };
  },
  computed: {
    isRelay: () => store.getters["sysStatus/isRelay"],
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.MESH_SETTING,
        networking: "0",
      });
      this.mesh_switch = res.mesh_switch == "1";
      clearTimeout(window.getMeshStatus);
      res.mesh_switch == "1" && this.getStatus();
    },
    async getStatus() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.MESH_SETTING,
        networking: "0",
      });
      if (res.ReinitWifiFlag == "1") {
        this.loading = true;
        window.getMeshStatus = setTimeout(() => {
          this.getStatus();
        }, 3000);
      } else {
        clearTimeout(window.getMeshStatus);
        this.loading = false;
      }
    },
    meshSwitchChange(e) {
      this.$loading_tool({ loading: true });
      let json = {
        mesh_switch: e ? "1" : "0",
        cmd: this.$CMD.MESH_SETTING,
        networking: "0",
      };
      this.$axiosRequest_post(json).then((res) => {
        if (res.success) {
          if (!e) {
            setTimeout(() => {
              this.$loading_tool({ loading: false });
              this.$message.success(this.$t("tips.setSuccess"));
            }, 5000);
          } else {
            this.$loading_tool({ loading: false });
            this.$message.success(this.$t("tips.setSuccess"));
            clearTimeout(window.getMeshStatus);
            store.dispatch("sysStatus/getMeshStatus")//更新vuexMESH开关状态
            this.getStatus();
          }
        } else {
          this.$message.error(this.$t("tips.setFail"));
          this.$loading_tool({ loading: false });
        }
      });
    },
    startMesh() {
      this.$loading_tool({ loading: true });
      this.$axiosRequest_post({
        mesh_switch: "1",
        cmd: this.$CMD.MESH_SETTING,
        networking: "1",
      }).then((res) => {
        this.$loading_tool({ loading: false });
        if (res.success) {
          this.$message.success(this.$t("tips.setSuccess"));
        } else {
          this.$message.error(this.$t("tips.setFail"));
        }
      });
    },
  },
};
</script>