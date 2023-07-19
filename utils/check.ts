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