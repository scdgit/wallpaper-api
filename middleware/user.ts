import jwt from 'jsonwebtoken'
import { TOKEN_KEY } from '../config'

/**Token校验 */
export const checkToken = (req: any, res: any, next: Function) => {
   const token = req.headers.authorization.split(' ')[1]
   jwt.verify(token, TOKEN_KEY, (err: any, decoded: any) => {
      if (err) {
         // Token 校验失败
         return res.status(401).json({ message: '无效的token', code: 0 })
      }
      // Token 验证通过
      req.userId = decoded.userId // 将解码后的用户ID存储在请求中，以便后续处理使用
      next()
   })
} 