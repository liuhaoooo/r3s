<template>
  <div class="meshMap-content" ref="meshMap">
    <a-empty v-show="empty" style="padding-top: 60px">
      <span slot="description"> 暂无数据，请稍后... </span>
    </a-empty>
  </div>
</template>

<script>
import * as vis from "vis-network";
import { DataSet } from "vis-data";
export default {
  data() {
    return {
      empty: false,
      dataTmp: null,
    };
  },
  mounted() {
    clearTimeout(window.getMeshData);
    this.getData();
  },
  beforeDestroy() {
    clearTimeout(window.getMeshData);
  },
  methods: {
    async getData() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.NETWORK_TOPOLOPY,
      });
      if (res.success && res["topology information"] && res["topology information"].length > 0) {
        this.createData(res["topology information"]);
      } else {
        this.empty = true;
      }
      window.getMeshData = setTimeout(() => {
        this.getData();
      }, 5000);
    },
    createData(datas) {
      let nodes_options = [],
        edges_options = [];
      for (let i in datas) {
        let macInfo = `${datas[i]["AL MAC"]}\n${datas[i]["Medium"]=='None'?'':'Medium-'+datas[i]['Medium']}`
        switch(datas[i]["Device role"]){
          case "00":
          nodes_options.push({
            id: datas[i]["AL MAC"],
            label: `Unknown\nAL_MAC-${macInfo}`,
            color: "#ccc",
          });
          break;
          case "01":
          nodes_options.push({
            id: datas[i]["AL MAC"],
            label: `Controller\nAL_MAC-${macInfo}`,
            color: "#85cafd",
            shape: "box",
          });
          break;
          case "02":
          nodes_options.push({
            id: datas[i]["AL MAC"],
            label: `Agent\nAL_MAC-${macInfo}`,
            color: "#f9ea3d",
          });
          break;
        }
        let clients = datas[i]["Other Clients Info"];
        for (let j in clients) {
          let tag_nodes = nodes_options.filter(
            (item) => item.id === clients[j]["Client Address"]
          );
          if (tag_nodes.length == 0) {
            nodes_options.push({
              id: clients[j]["Client Address"],
              label: `STA\nMAC-${clients[j]["Client Address"]}\n${clients[j]["Medium"]=='None'?'':'Medium-'+clients[j]['Medium']}`,
              color: "#24e420",
            });
          }
          edges_options.push({
            from: clients[j]["Client Address"],
            to: datas[i]["AL MAC"],
            id: clients[j]["Client Address"] + "to" + datas[i]["AL MAC"],
            dashes: clients[j].Medium == "2G" || clients[j].Medium == "5G"
          });
        }
        if (datas[i]["Upstream 1905 device"] != "00:00:00:00:00:00") {
          edges_options.push({
            from: datas[i]["AL MAC"],
            to: datas[i]["Upstream 1905 device"],
            color: "#f9ea3d",
            id: datas[i]["AL MAC"] + "to" + datas[i]["Upstream 1905 device"],
            dashes: datas[i].Medium == "2G" || datas[i].Medium == "5G"
          });
        }
      }
      const container = this.$refs.meshMap;
      // 全局样式配置
      const options = {
        nodes:{
          borderWidth:0,
          shadow:{
            enabled:true
          }
        },
        edges: {
          length: 250,
          width: 2,
          color: "#24e420",
          arrows: "to",
        },
        physics: {
          enabled: true,
          barnesHut: {
            damping: 1,
          },
        },
      };
      if (
        JSON.stringify(this.dataTmp) !=
        JSON.stringify([...nodes_options, ...edges_options])
      ) {
        new vis.Network(
          container,
          {
            nodes: new DataSet(nodes_options),
            edges: new DataSet(edges_options),
          },
          options
        );
      }
      this.dataTmp = [...nodes_options, ...edges_options];
    },
  },
};
</script>