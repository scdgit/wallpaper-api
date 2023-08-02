import { NICKNAME, AVATAR, AVATAR_URL } from "../config/user"

/**
 * 随机生成头像
 * @returns 昵称
 */
export const randomNickname = (): string => {
   const random = Math.floor(Math.random() * NICKNAME.length)
   const nickname = NICKNAME[random]
   return nickname
}

/**
 * 获取随机头像
 * @returns 头像
 */
export const randomAvatar = (): string => {
   const random = Math.floor(Math.random() * AVATAR.length)
   const avatar = AVATAR[random]
   return `${AVATAR_URL}/${avatar}`
}