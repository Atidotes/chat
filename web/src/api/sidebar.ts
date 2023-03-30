import request from "@/util/axios.config";

export const upload = (params: FormData): Promise<IResult> => request({
  method: 'POST',
  url: 'user/upload',
  data: params,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

export const uploadAudio = (params: FormData): Promise<IResult> => request({
  method: 'POST',
  url: 'user/audio',
  data: params,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})