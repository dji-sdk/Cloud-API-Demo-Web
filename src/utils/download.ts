/**
 * 加载图片
 * @param url
 * @returns
 */
export function urlToImage (url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.onload = () => { resolve(image) }
    image.onerror = () => { reject(new Error('image load error')) }
  })
}

export interface CompressImageData {
  blob: Blob | null;
  imageData: ImageData;
}
export function compressImage (imgToCompress: HTMLImageElement, targetWidth: number, targetHeight: number): Promise<CompressImageData> | undefined {
  // resizing the image
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (context) {
    const iWidth = imgToCompress.width
    const iHeight = imgToCompress.height
    const iRatio = iWidth / iHeight // 图像宽高比
    const tRatio = targetWidth / targetHeight // 目标宽高比
    let dw = targetWidth
    let dh = targetHeight
    let dx = 0
    let dy = 0
    if (iRatio > tRatio) {
      // 如果图像宽高比比目标宽高比要大，说明图像比目标尺寸更宽，这时候我们应该按照高度缩放比来进行缩放宽度
      dw = (targetHeight / iHeight) * iWidth
      // 宽度溢出，应该放在中间
      dx = -(dw - targetWidth) / 2
    } else {
      // 否则说明图像比目标尺寸更高，按照宽度缩放比来缩放高度
      dh = (targetWidth / iWidth) * iHeight
      // 高度溢出，应该放在中间
      dy = -(dh - targetHeight) / 2
    }

    canvas.width = targetWidth
    canvas.height = targetHeight

    context.drawImage(
      imgToCompress,
      dx,
      dy,
      dw,
      dh,
    )

    return new Promise<CompressImageData>((resolve) => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      canvas.toBlob(blob => resolve({
        blob,
        imageData,
      }))
    })
  }
}

/**
 * 根据资源url下载文件
 * @param url
 * @param fileName
 */
export function download (url: string, fileName = ''): void {
  const aLink = document.createElement('a')
  aLink.style.display = 'none'
  aLink.download = fileName
  aLink.href = url
  document.body.appendChild(aLink)
  // 避免新开页面，闪烁
  // aLink.target = '_blank'
  aLink.click()
  document.body.removeChild(aLink)
  // aLink.remove()
}
