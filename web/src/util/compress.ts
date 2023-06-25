/** 定义类型接口 */

/** 自定义File */
interface IFile extends File {
  uid: number;
}

interface IFiles extends File {
  uid?: number;
}

/** 定义参数 */
interface IParameter {
  file: IFile
  scale?: number
  dataType?: string
  imageType?: string
}

/** 定义属性以及方法 */
interface ICompress {
  img: HTMLImageElement
  fr: FileReader
  name: string
  suffix: string | undefined
  createObjectFile: (fileData: Blob | string, filename: string, config: object) => Promise<IFiles>
  createObjectBlob: (fileData: Blob | string, config: object) => Promise<Blob>
  createObjectURL: (file: Blob | MediaSource) => Promise<string>
  transformBase64: () => Promise<Blob | string | IFile>
  createCanvas: () => Promise<Blob | string | IFile>
  compressData: (pressCanvas: any) => Promise<Blob | string | IFile>
}

/**
 * @class 压缩图片实例
 */
class Compress implements ICompress {
  img: HTMLImageElement;
  fr: FileReader;
  name: string;
  suffix: string | undefined;
  constructor(private params: IParameter) {
    this.params = Object.assign({
      scale: 0.8,
      dataType: 'file',
      imageType: 'image/webp',
    }, this.params)
    this.img = new Image();
    this.fr = new FileReader()
    this.name = this.params.file.name.split('.')[0]
    this.suffix = this.params.imageType?.split('/')[1]
  }

  /** 文件转化为File文件 */
  async createObjectFile(fileData: Blob | string, filename: string, config: object = { type: this.params.imageType, lastModified: this.params.file.lastModified }) {
    let { file } = this.params
    let files: IFiles = new File([fileData], `${filename}.${this.suffix}`, config)
    files.uid = file.uid
    return files
  }

  /** 文件转化为Blob文件 */
  async createObjectBlob(fileData: Blob | string, config: object = { type: this.params.imageType }) {
    return new Blob([fileData], config)
  }

  /** 文件转化为临时URL地址 */
  async createObjectURL(file: Blob | MediaSource) {
    return URL.createObjectURL(file);
  }

  /** 将图片转化为base64格式 */
  transformBase64() {
    return new Promise(async (resolve: (value: Promise<Blob | string | IFile>) => void, reject: (value: string) => void) => {
      try {
        let blob = await this.createObjectBlob(this.params.file)
        this.fr.readAsDataURL(blob);
        this.fr.onload = () => {
          // 创建图片
          this.img.src = this.fr.result as string;
          this.img.crossOrigin = "anonymous";

          resolve(this.createCanvas())
        }
      } catch (e) {
        console.error(e);
        reject('将图片转化为base64格式发生错误！')
      }
    })
  }

  /** 创建画布 */
  createCanvas() {
    return new Promise((resolve: (value: Blob | string | IFile) => void, reject: (value: string) => void) => {
      try {
        this.img.onload = async () => {
          // 创建canvas
          let pressCanvas: HTMLCanvasElement = document.createElement("canvas");
          pressCanvas.width = this.img.width;
          pressCanvas.height = this.img.height;
          let ctx: CanvasRenderingContext2D | null = pressCanvas.getContext("2d");
          if (ctx) {
            // 清空画布
            ctx.clearRect(0, 0, this.img.width, this.img.height);
            // 绘制图片
            ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
          }
          resolve(await this.compressData(pressCanvas))
        }
      } catch (e) {
        console.error(e)
        reject('Canvas压缩图片发生错误！')
      }
    })
  }

  /** 判断压缩格式 */
  compressData(pressCanvas: HTMLCanvasElement) {
    return new Promise((resolve: (value: Blob | string | IFile) => void, reject: (value: string) => void) => {
      try {
        let { imageType, scale, dataType } = this.params
        switch (dataType) {
          case 'base64':
            return resolve(pressCanvas.toDataURL(imageType, scale) as string)
          case 'blob':
            return pressCanvas.toBlob((blob) => {
              resolve(blob as Blob)
            }, imageType, scale)
          case 'file':
            return pressCanvas.toBlob(async (blob) => {
              resolve(await this.createObjectFile(blob as Blob, this.name))
            }, imageType, scale)
          default:
            new Error('没有此类型数据转化')
            break;
        }
      } catch (e) {
        console.error(e);
        reject('压缩数据判断失败')
      }
    })
  }

  /**
   * 静态方法暴露数据
   * @param {object} params
   * file 图片文件对象
   * scale 图片压缩比例
   * dataType 图片压缩后数据类型 blob || base64
   * imageType 图片格式
   * @returns 图片压缩后的数据
   */
  static async exportData(params: IParameter): Promise<Blob | string> {
    return await new Compress(params).transformBase64()
  }
};

/**
 * 导出图片压缩后数据
 */
const compress = async (params: IParameter) => {
  return await Compress.exportData(params)
}
export default compress
