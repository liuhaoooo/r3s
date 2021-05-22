<template>
  <div class="main-unlogin">
    <a-popover
      v-model="qrcodeShow"
      trigger="click"
      class="qrcode"
      placement="rightTop"
    >
      <a slot="content" @click="qrcodeShow = !qrcodeShow">
        <img src="../../assets/images/image_qrcode.png" alt style="width: 120px" />
      </a>
      <a style="color:#41a5e0">手机客户端</a>
    </a-popover>
    <div class="login-content">
      <label for>欢迎使用中国移动路由器 {{deviceInfo.board_type || "RAX3000-Q"}}</label>
      <span>此密码为登录本设备的配置页面</span>
      <a-form :form="form">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          :label="$t('login.username')"
          class="a-form-item"
        >
          <a-input
            class="a-input"
            :maxLength="32"
            v-decorator="[
              'username',
              { rules: [{ required: false, message: $t('login.inputusername') }] },
            ]"
            :placeholder="$t('login.inputusername')"
            @change="(e) => (this.username = e.target.value)"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          :label="$t('login.password')"
          class="a-form-item"
        >
          <a-input
            class="a-input"
            :maxLength="32"
            v-decorator="[
              'password',
              { rules: [{ required: false, message: $t('login.inputpassword') }] },
            ]"
            :placeholder="$t('login.inputpassword')"
            type="password"
            @change="(e) => (this.password = e.target.value)"
          />
        </a-form-item>
      </a-form>
      <div>
        <a @click="() => (modalVisible = true)"
          >{{$t('login.forget')}}</a
        >
      </div>
      <a-button
        type="primary"
        @click="login"
        class="a-buttom"
        :disabled="loginTimesIsShow || !password || !username"
        :loading="loading"
      >
        {{ loginTimesIsShow ? times : $t("tips.login") }}
      </a-button>
    </div>
    <!-- modal -->
    <a-modal
      v-model="modalVisible"
      centered
      :closable="false"
      :footer="false"
      width="450px"
    >
      <div class="modal-content">
        <!-- <div></div> -->
        <br>
        <span>
          忘记密码，可以将路由器恢复出厂设置，恢复出厂设置后密码将重置，查看路由器背面的铭牌获取密码，但同时您的数据会被清除，请谨慎操作。
        </span>
        <br>
        <a-button
          type="primary"
          @click="() => (modalVisible = false)"
          class="a-buttom"
          >{{ $t("tips.ok") }}</a-button
        >
      </div>
    </a-modal>
  </div>
</template>

<script>
import md5 from "js-md5";
import { Base64 } from "js-base64";
import store from "../../store";
import { rsaEnc_tool, rsaDec_tool } from "../../utils/tools";
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
export default {
  data() {
    return {
      checkNick: false,
      formItemLayout,
      form: this.$form.createForm(this, { name: "dynamic_rule" }),
      password: "",
      username: "",
      modalVisible: false,
      loading: false,
      loginTimesIsShow: false,
      times: 0,
      qrcodeShow: true,
    };
  },
  computed:{
     deviceInfo: () => store.getters["sysStatus/deviceInfo"]
  },
  mounted() {
    sessionStorage.clear()
    this.getNextText();
    window.addEventListener("keydown", this.keyDown);
  },
  destroyed() {
    window.removeEventListener("keydown", this.keyDown, false);
  },
  methods: {
    keyDown(e) {
      if (
        e.keyCode == 13 &&
        !this.loginTimesIsShow &&
        this.password &&
        this.username
      ) {
        this.login();
      }
    },
    login() {
      this.form.validateFields((err) => {
        if (!err) {
          this.loading = true;
          let json = {
            cmd: this.$CMD.LOGIN,
            username: this.username,
            passwd: Base64.encode(md5(this.password)),
            isAutoUpgrade: "0",
          };
          this.$axiosRequest_post(json)
            .then((res) => {
              if (res.login_fail == "fail") {
                this.loading = false;
                this.$error({
                  title:
                    "用户名或者密码错误,剩余登录次数" + res.login_times + "次",
                  okText: "知道了",
                  centered: true,
                });
                if (parseInt(res.login_times, 10) < 1) {
                  this.getNextText();
                }
              } else {
                sessionStorage.setItem("sessionId", rsaEnc_tool(res.sessionId));
                this.loading = false;
                store.commit("sysStatus/setIsMore",false)
                this.$router.push({ name: "Simple_home" });
                this.$message.success("登录成功", 1);
              }
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      });
    },
    async getNextText() {
      let res = await this.$axiosRequest_get({
        cmd: this.$CMD.GET_NEXT_LOGIN_TIME,
      });
      if (res.buffer == "0") {
        this.times = 180 - res.netx_login_time;
        this.loginTimesIsShow = true;
        setTimeout(() => {
          this.getNextText();
        }, 1000);
      } else {
        this.loginTimesIsShow = false;
      }
    },
  },
};
</script>