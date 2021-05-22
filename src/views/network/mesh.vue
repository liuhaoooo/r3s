<template>
  <div>
    <headerInfo
      :labelText="$t('help.title3')"
      :spanText="$t('help.details3')"
    />
    <a-spin :spinning="loading" :indicator="indicator" :tip="$t('tips.sysSetting')">
      <a-form-model layout="inline" class="mesh-header">
        <a-form-model-item :label="$t('mesh.meshEnable')">
          <a-switch v-model="mesh_switch" :disabled="isRelay"/>
        </a-form-model-item>
        <a-form-model-item :label="'主从模式'">
          <a-select style="width:120px" v-model="mesh_role" :disabled="!mesh_switch || isRelay">
            <a-select-option value="0">自动</a-select-option>
            <a-select-option value="1">主模式</a-select-option>
            <a-select-option value="2">从模式</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            style="margin-right: 30px"
            type="primary"
            :disabled="isRelay"
            @click="saveClick"
            >保存</a-button
          >
          <a-button
            type="primary"
            :disabled="!mesh_switch_status || isRelay"
            @click="startMesh"
            >{{$t('mesh.startMesh')}}</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <div class="meshMap-content" v-if="!mesh_switch_status || isRelay">
      <a-empty style="padding-top: 60px;">
        <span slot="description" v-if="isRelay"> {{$t('tips.isRelay')}}</span>
        <span slot="description" v-else> {{$t('tips.mesh_switch')}} </span>
        <a-button type="primary" @click="$router.push({name:'Simple_network'})" v-if="isRelay"> 前往切换 </a-button>
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
      mesh_switch_status: false,
      loading: false,
      mesh_role: "0",//角色
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
      this.mesh_switch_status = res.mesh_switch == "1";
      this.mesh_role = res.mesh_role || '0'
      clearTimeout(window.getMeshStatus);
      res.mesh_switch == "1" && this.getStatus();
    },
    async getStatus() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.MESH_SETTING,
        networking: "0",
      });
      console.log(res.mesh_running)
      if (res.mesh_running == "0") {
        this.loading = true;
        window.getMeshStatus = setTimeout(() => {
          this.getStatus();
        }, 3000);
      } else {
        clearTimeout(window.getMeshStatus);
        this.loading = false;
      }
    },
    saveClick() {
      this.$loading_tool({ loading: true });
      let json = {
        mesh_switch: this.mesh_switch ? "1" : "0",
        mesh_role: this.mesh_role,
        cmd: this.$CMD.MESH_SETTING,
        networking: "0",
      };
      this.$axiosRequest_post(json).then((res) => {
        if (res.success) {
          this.getData();
          if (!this.mesh_switch) {//当关闭MESH时多等待5秒
            clearTimeout(window.getMeshData);
            setTimeout(() => {
              this.$loading_tool({ loading: false });
              this.$message.success(this.$t("tips.setSuccess"));
            }, 5000);
          } else {
            this.$loading_tool({ loading: false });
            this.$message.success(this.$t("tips.setSuccess"));
            store.dispatch("sysStatus/getMeshStatus")//更新vuexMESH开关状态
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