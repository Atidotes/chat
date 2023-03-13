import request from "@/util/axios.config";

export const login = (data:object) => request({method:'POST',url:'/login',data})