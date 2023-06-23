/** 定义类型接口 */
interface ICompress {
  file: Blob
  scale?: number | undefined
  conversionType?: string | undefined
  img: HTMLImageElement
  fr: FileReader
  transformBase64: () => Promise<Blob | string>
  compressBase64: () => Promise<Blob | string>
}

/**
 * 压缩图片实例
 */
class Compress implements ICompress {
  file: Blob
  scale?: number | undefined;
  conversionType?: string | undefined;
  img: HTMLImageElement;
  fr: FileReader;

  /**
   * 实例原型
   * @param {Blob} file 图片文件对象
   * @param {number} scale 图片压缩比例
   * @param {string} conversionType 图片压缩后数据类型 blob || base64
   */
  constructor(file: Blob, scale: number = 0.8, conversionType: string = 'blob') {
    this.file = file
    this.scale = scale
    this.conversionType = conversionType
    this.img = new Image();
    this.fr = new FileReader()
  }

  /**
   * 将图片转化为base64格式
   * @returns Promise 图片压缩后数据
   */
  transformBase64() {
    return new Promise((resolve: (value: Promise<Blob | string>) => void, reject: (value: string) => void) => {
      this.fr.readAsDataURL(this.file);
      this.fr.onload = () => {
        // 创建图片
        this.img.src = this.fr.result as string;
        this.img.crossOrigin = "anonymous";

        resolve(this.compressBase64())
      }

      this.fr.onerror = () => {
        reject('将图片转化为base64格式发生错误！')
      }
    })
  }

  /**
   * Canvas压缩图片
   * @returns Promise压缩数据
   */
  compressBase64() {
    return new Promise((resolve: (value: Blob | string) => void, reject: (value: string) => void) => {
      this.img.onload = () => {
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

        // 压缩图片
        if (this.conversionType === "base64") {
          resolve(pressCanvas.toDataURL() as string);
        } else if (this.conversionType === "blob") {
          pressCanvas.toBlob(blob => {
            resolve(blob as Blob)
          }, "image/webp", this.scale)
        }
      }
      this.img.onerror = () => {
        reject('Canvas压缩图片发生错误！')
      }
    })
  }

  /**
   * 静态方法暴露数据
   * @param {blob} file 图片文件对象
   * @param {number} scale 图片压缩比例
   * @param {string} conversionType 图片压缩后数据类型 blob || base64
   * @returns 图片压缩后的数据
   */
  static async exportData(file: Blob, scale?: number, conversionType?: string): Promise<Blob | string> {
    return await new Compress(file, scale, conversionType).transformBase64()
  }
};

/**
 * 导出图片压缩后数据
 */
export default async (file: Blob, scale?: number, conversionType?: string) => {
  return Compress.exportData(file, scale, conversionType)
}

