export const helpList = [
    {
        title: "宽带设置",
        child: {
            "连接方式:":"包括通过IP方式建立连接，通过PPPOE拨号方式建立连接和桥接模式三种。根据实际的网络需要选择对应类型。",
            "IP协议版本:":"设置使用的IP版本，通常使用IPv4，也可以通过选择IPv6来支持IPv6。如果选择IPv4/v6方式，则同时使用IPv4和IPv6两种IP版本。",
            "IP获取方式:":"DHCP：自动获取IP。<br/>Static：静态配置IP地址。需要输入的信息包括：IP地址，子网掩码，首选DNS服务器及备用DNS服务器等，IP地址必须输入正确的格式。",
            "IPv6 WAN信息获取方式:":"可以通过DHCP或者SLAAC两种方式动态的获取IPv6的地址，也可以静态设置IPv6的地址，根据具体的网络情况进行设置。",
            "MTU":"最大传输单元,用来通知对方所能接受数据服务单元的最大尺寸。如非必要，请勿修改。"
        }
    },
    {
        title: "Wi-Fi设置",
        child: {
            "Wi-Fi功能":"选中时开启无线路由器Wi-Fi功能；不选中时关闭无线路由器Wi-Fi功能,网络只能使用有线方式连接.",
            "Wi-Fi广播:":"选中时开启SSID广播,其他无线设备可以通过搜索网络搜索到本机的SSID；不选中时关闭SSID广播,不能搜索到本机的SSID,但是通过手工输入SSID,其他客户端可以连接上.",
            "无线网络标识(SSID):":"SSID可以简单理解为无线网络的名称,机身及包装标识可见此SSID默认名称.SSID名称由最多不超过32个字符的字母和数字组成,区分大小写。",
            "认证类型:":"WIFI连接选用的安全形式，无验证、WPA-PSK、WPA2-PSK",
            "安全密钥":"最大传输单元,设置无线连接的网络密码,密码长度为8~63个字符."
        }
    },
    {
        title: "WPS",
        child: {
            "WPS:":"开启使能开关后，本地页面点击开始配置或在设备上按WPS按键1~3秒启动WPS功能。",
        }
    },
    {
        title: "DHCP",
        child: {
            "LAN IP地址:":"设置无线路由器本地IP地址。",
            "子网掩码:":"子网掩码为IP地址中的网络号。",
            "DHCP服务器:":"设置是否启用DHCP服务,启用时为本路由器上连接的所有客户端自动分配IP地址。",
            "IP地址池:":"启用DHCP服务时,设置自动分配IP地址的范围。",
            "租期时间:":"启用DHCP服务时,设置租期时间.默认为一天,非专业人士不建议修改。",
        }
    },
    {
        title: "MESH",
        child: {
            "组网:":"准备至少两台路由器，分别连接电源，等待设备启动完成（大约需要两分钟）;将其中一台路由器的WAN口通过网线连接上网，该路由器为主路器；",
            "方式一（软件MESH组网）:":`1）分别登录主路由器和从路由器的本地管理页面，选择“设备配置” -> “MESH”,确认组网开关处于开启状态，并点击“启动组网”按钮，等待组网即可；<br/>
            2）当路由器设备上的MESH指示灯常亮时，则表示组网成功；`,
            "方式二（一键组网）:":`1）分别登录主路由器和从路由器的本地管理页面，选择“设备配置”-> “MESH”,确认组网开关处于开启状态；<br/>
            2）长按6秒主路由器后面的WPS/MESH按键；<br/>
            3）随后同样长按从路由器后面的WPS/MESH按键；<br/>
            4）等待一分钟左右的时间；<br/>
            5）当路由器设备上的MESH指示灯常亮时，则表示组网成功。`,
        }
    },
    {
        title: "防火墙基础设置",
        child: {
            "防火墙等级配置:":"可对防火墙等级设置成低级、中级、高级",
            "DMZ:":"它是为了解决安装防火墙后外部网络不能访问内部网络服务器的问题，而设立的一个非安全系统与安全系统之间的缓冲区。",
        }
    },
]