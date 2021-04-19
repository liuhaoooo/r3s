import axios from 'axios'
import router from '../router'
import store from "../store";
import { message } from 'ant-design-vue';
import { rsaDec_tool, loading_tool } from "../utils/tools";
message.config({
  duration: 3,
  maxCount: 3,
});
const baseURL = '/cgi-bin/http.cgi'
const request = axios.create({
  baseURL,
  timeout: 60000,
});
// 请求拦截器
request.interceptors.request.use((config) => {
  config.method = 'post'
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use((response) => {
  if (!response.data.success && response.data.message == "NO_AUTH") {
    router.push({ name: "Login" });
    loading_tool({ loading: false })
    if(store.state.sysStatus.needRedirect)window.location.reload();
  }
  return response.data;
}, (error) => {
  return Promise.reject(error);
});

export const axiosRequest_get = async (data) => {
  data.method = 'GET'
  data.sessionId = rsaDec_tool(sessionStorage['sessionId']) || ''
  let res = await request({ data })
  return res
}
export const axiosRequest_post = async (data) => {
  data.method = 'POST'
  data.sessionId = rsaDec_tool(sessionStorage['sessionId']) || ''
  let res = await request({ data })
  return res
}
export const axiosRequest_upload = async (data, options) => {
  data.method = 'POST'
  data.sessionId = rsaDec_tool(sessionStorage['sessionId']) || ''
  let url = `${baseURL}?cmd=${options.cmd}&method=POST&sessionId=${data.sessionId}`
  let res = await axios.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  if (!res.data.success && res.data.message == "NO_AUTH") {
    loading_tool({ loading: false })
    router.push({ name: "Login" });
  }
  return res.data
}