// 用户名校验
export const unameCheck = (uname: string) => {
   const regex = /^[a-zA-Z0-9_]{3,16}$/
   return regex.test(uname)
}

// 密码校验
export const passwordCheck = (password: string) => {
   const regex = /^[a-zA-Z0-9_]{6,12}$/
   return regex.test(password)
}

// 订单号校验
const uuidV4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
/**
 * 订单号校验，是否由本系统生成的订单号
 * @param orderNumber 订单号
 * @returns 
 */
export const validateOrderNumber = (orderNumber: string) => {
  return uuidV4Regex.test(orderNumber)
}