/**
 * 下载文件
 * @param data
 * @param fileName
 */
export function downloadFile (data: Blob, fileName: string) {
  const lable = document.createElement('a')
  lable.href = window.URL.createObjectURL(data)
  lable.download = fileName
  lable.click()
  URL.revokeObjectURL(lable.href)
}
