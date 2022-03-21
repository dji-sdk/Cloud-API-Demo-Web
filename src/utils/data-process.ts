export function formatPhoneNum (phoneNum: string | number) {
  const str = String(phoneNum)
  return str.substring(0, 3) + '****' + str.slice(-4)
}
