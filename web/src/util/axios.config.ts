import axios from 'axios'

const requests = axios.create({
  baseURL: '/web/api',
  timeout: 500,
})

// 添加请求拦截器
requests.interceptors.request.use((config) => {
  
  const token = localStorage.getItem('token')
  config.headers.Authorization = `Bearer ${token}`
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 添加响应拦截器
requests.interceptors.response.use((response) => {

  const { authorization } = response.headers
  localStorage.setItem('token', authorization)

  return response.data;
}, (error) => {
  return Promise.reject(error);
});

export default requests