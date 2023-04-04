import request from "@/util/axios.config";

/** 上传头像 */
export const upload = (params: FormData): Promise<IResult> => request({
  method: 'POST',
  url: '/user/upload',
  data: params,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

/** 上传音频 */
export const uploadAudio = (params: FormData): Promise<IResult> => request({
  method: 'POST',
  url: '/user/audio',
  data: params,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

/** 修改密码 */
export const password = (data: Object): Promise<IResult> => request({ url: '/user/changePassword', method: 'POST', data })
