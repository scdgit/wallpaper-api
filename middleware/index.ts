import jwt from 'jsonwebtoken'
import { TOKEN_KEY } from '../config'

/*** 校验为空的参数[中间件] */
export const checkParamsIsNull = (req: any, res: any, next: Function) => {
   const method = req.method.toUpperCase()
   const params = method === 'GET' ? req.query : req.body
   if (JSON.stringify(params) === '{}') return res.status(400).json({ msg: '未传递任何参数，请确认传递的方式是否正确！', code: 0 })
   const keys = []
   for (let key in params) {
      if (!params[key]) keys.push(key)
   }
   if (keys.length > 0) return res.status(400).json({ msg: `传递的${keys.join('-')}为空`, code: 0 })
   next()
}

/*** Token校验[中间件] */
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