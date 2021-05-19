import axios from "axios";

export function request(config){
  //1.创建axios实例对象
  const instance = axios.create({
    baseURL:'http://152.136.185.210:7878/api/m5',
    timeout:5000
  })

  //2.axios拦截器
  //拦截请求（请求成功，请求失败）
  instance.interceptors.request.use(config => {
    return config
  },err => {

  })
  //拦截响应（响应成功，响应失败）
  instance.interceptors.response.use(res => {
    return res.data
  },err => {

  })

  //3.发送真正的网络请求
  return instance(config)
}
