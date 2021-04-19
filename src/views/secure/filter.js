import { i18n } from "../../i18n"
export const columns = {
  ip: [
    {
      title: i18n.t("firewall.enable"),
      dataIndex: "enableRule",
      width: 70,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableRule" },
    },
    {
      title: "IPv4/IPv6",
      dataIndex: "ippro",
      ellipsis: true,
      width: 100,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "ippro" },
    },
    {
      title: i18n.t("firewall.protocol"),
      dataIndex: "protocol",
      ellipsis: true,
      width: 80,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "protocol" },
    },
    {
      title: i18n.t("firewall.ip"),
      dataIndex: "ip",
      ellipsis: true,
      scopedSlots: { customRender: "ip" },
    },
    {
      title: i18n.t("firewall.remark"),
      dataIndex: "remark",
      ellipsis: true,
      scopedSlots: { customRender: "remark" },
    },
    {
      title: i18n.t("firewall.enableLink"),
      dataIndex: "enableLink",
      ellipsis: true,
      width: 90,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableLink" },
    },
    {
      title: i18n.t("firewall.operation"),
      width: 110,
      className: 'column-center-th column-center-td',
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" },
    }
  ],
  port: [
    {
      title: i18n.t("firewall.enable"),
      dataIndex: "enableRule",
      width: 70,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableRule" },
    },
    {
      title: "IPv4/IPv6",
      dataIndex: "ippro",
      ellipsis: true,
      width: 100,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "ippro" },
    },
    {
      title: i18n.t("firewall.protocol"),
      dataIndex: "protocol",
      ellipsis: true,
      width: 80,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "protocol" },
    },
    {
      title: i18n.t("firewall.port"),
      dataIndex: "port",
      ellipsis: true,
      scopedSlots: { customRender: "port" },
    },
    {
      title: i18n.t("firewall.remark"),
      dataIndex: "remark",
      ellipsis: true,
      scopedSlots: { customRender: "remark" },
    },
    {
      title: i18n.t("firewall.enableLink"),
      dataIndex: "enableLink",
      ellipsis: true,
      width: 90,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableLink" },
    },
    {
      title: i18n.t("firewall.operation"),
      width: 110,
      className: 'column-center-th column-center-td',
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" },
    }
  ],
  mac: [
    {
      title: i18n.t("firewall.enable"),
      dataIndex: "enableRule",
      width: 70,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableRule" },
    },
    {
      title: "IPv4/IPv6",
      dataIndex: "ippro",
      ellipsis: true,
      width: 100,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "ippro" },
    },
    {
      title: i18n.t("firewall.mac"),
      dataIndex: "mac",
      ellipsis: true,
      scopedSlots: { customRender: "mac" },
    },
    {
      title: i18n.t("firewall.remark"),
      dataIndex: "remark",
      ellipsis: true,
      scopedSlots: { customRender: "remark" },
    },
    {
      title: i18n.t("firewall.enableLink"),
      dataIndex: "enableLink",
      ellipsis: true,
      width: 90,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableLink" },
    },
    {
      title: i18n.t("firewall.operation"),
      width: 110,
      className: 'column-center-th column-center-td',
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" },
    }
  ],
  url: [
    {
      title: i18n.t("firewall.enable"),
      dataIndex: "enableRule",
      width: 70,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableRule" },
    },
    {
      title: "IPv4/IPv6",
      dataIndex: "ippro",
      ellipsis: true,
      width: 100,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "ippro" },
    },
    {
      title: i18n.t("firewall.url"),
      dataIndex: "url",
      ellipsis: true,
      scopedSlots: { customRender: "url" },
    },
    {
      title: i18n.t("firewall.remark"),
      dataIndex: "remark",
      ellipsis: true,
      scopedSlots: { customRender: "remark" },
    },
    {
      title: i18n.t("firewall.enableLink"),
      dataIndex: "enableLink",
      ellipsis: true,
      width: 90,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableLink" },
    },
    {
      title: i18n.t("firewall.operation"),
      width: 110,
      className: 'column-center-th column-center-td',
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" },
    }
  ],
  ipmac: [
    {
      title: i18n.t("firewall.enable"),
      dataIndex: "enableRule",
      width: 70,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableRule" },
    },
    {
      title: "IPv4/IPv6",
      dataIndex: "ippro",
      ellipsis: true,
      className: 'column-center-th column-center-td',
      width: 100,
      scopedSlots: { customRender: "ippro" },
    },
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
      title: i18n.t("firewall.remark"),
      dataIndex: "remark",
      ellipsis: true,
      scopedSlots: { customRender: "remark" },
    },
    {
      title: i18n.t("firewall.operation"),
      width: 110,
      dataIndex: "operation",
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "operation" },
    }
  ],
  portMapping: [
    {
      title: i18n.t("firewall.enable"),
      dataIndex: "enableRule",
      width: 70,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableRule" },
    },
    {
      title: i18n.t("firewall.protocol"),
      dataIndex: "protocol",
      ellipsis: true,
      width: 80,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "protocol" },
    },
    {
      title: i18n.t("firewall.portBegin"),
      dataIndex: "port",
      ellipsis: true,
      width: 100,
      scopedSlots: { customRender: "port" },
    },
    {
      title: i18n.t("firewall.mappingIp"),
      dataIndex: "mappingIp",
      ellipsis: true,
      scopedSlots: { customRender: "mappingIp" },
    },
    {
      title: i18n.t("firewall.mappingPort"),
      dataIndex: "mappingPort",
      ellipsis: true,
      width: 100,
      scopedSlots: { customRender: "mappingPort" },
    },
    {
      title: i18n.t("firewall.remark"),
      dataIndex: "remark",
      ellipsis: true,
      scopedSlots: { customRender: "remark" },
    },
    {
      title: i18n.t("firewall.operation"),
      width: 110,
      dataIndex: "operation",
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "operation" },
    }
  ],
  acl: [
    {
      title: i18n.t("firewall.enable"),
      dataIndex: "enableRule",
      width: 70,
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "enableRule" },
    },
    {
      title: i18n.t("firewall.protocol"),
      dataIndex: "protocol",
      ellipsis: true,
      className: 'column-center-th column-center-td',
      width: 80,
      scopedSlots: { customRender: "protocol" },
    },
    {
      title: "IPv4/IPv6",
      dataIndex: "ippro",
      ellipsis: true,
      className: 'column-center-th column-center-td',
      width: 100,
      scopedSlots: { customRender: "ippro" },
    },
    {
      title: i18n.t('firewall.srcIp'),
      dataIndex: "srcIp",
      ellipsis: true,
      scopedSlots: { customRender: "srcIp" },
    },
    {
      title: i18n.t('firewall.destIp'),
      dataIndex: "destIp",
      ellipsis: true,
      scopedSlots: { customRender: "destIp" },
    },
    {
      title: i18n.t("firewall.remark"),
      dataIndex: "remark",
      ellipsis: true,
      scopedSlots: { customRender: "remark" },
    },
    {
      title: i18n.t("firewall.enableLink"),
      dataIndex: "enableLink",
      ellipsis: true,
      className: 'column-center-th column-center-td',
      width: 112,
      scopedSlots: { customRender: "enableLink" },
    },
    {
      title: i18n.t("firewall.operation"),
      width: 110,
      dataIndex: "operation",
      className: 'column-center-th column-center-td',
      scopedSlots: { customRender: "operation" },
    }
  ],
}

