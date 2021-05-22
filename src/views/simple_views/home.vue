<template>
  <div class="simple_home_content">
    <div class="main">
      <div class="info">
        <div>
          <div></div>
          <img src="../../assets/images/icon_wdwl_nor.png" alt="">
          <label>我的网络</label>
        </div>
        <div style="justify-content: center">
          <div><a-icon type="arrow-up" class="mytext-color" />上传速度</div>
          <div class="div2"><span style="font-size:1.3rem">112</span>kbps</div>
          <a-divider />
          <div><a-icon type="arrow-down" class="mytext-color" />下载速度</div>
          <div class="div4"><span style="font-size:1.3rem">105</span>kbps</div>
        </div>
        <div style="width:280px">
          <div></div>
          <img src="../../assets/images/route.png" alt="">
          <label>中国移动RX3000-Q路由</label>
        </div>
        <div style="justify-content: center">
          <a-divider class="mytext-color"><a-icon type="wifi" style="margin-right:6px"/>2.4G</a-divider>
          <a-divider class="mytext-color"><a-icon type="wifi" style="margin-right:12px"/>5G</a-divider>
          <a-divider class="mytext-color">有线</a-divider>
        </div>
        <div>
          <div></div>
          <img src="../../assets/images/icon_wdsb_nor.png" alt="">
          <label>我的设备：<a style="font-size:1.1rem;font-weight:bold;">3</a> 台</label>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>
        <label for="">192.168.0.1</label>
        <span>WAN IP</span>
      </div>
      <div style="width:1px;height:40%;background:#ccc"></div>
      <div>
        <label for="">0<span>天</span>21<span>小时</span>23<span>分钟</span></label>
        <span>系统运行时长</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>