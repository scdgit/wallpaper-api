import { NICKNAME, AVATAR, AVATAR_URL } from "../config/user"

/**
 * 随机生成头像
 * @returns 头像
 */
export const randomNickname = () => {
   const random = Math.floor(Math.random() * NICKNAME.length)
   const nickname = NICKNAME[random]
   return nickname
}

export const randomAvatar = () => {
   const random = Math.floor(Math.random() * AVATAR.length)
   const avatar = AVATAR[random]
   return `${AVATAR_URL}/${avatar}`
}