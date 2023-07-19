import express from 'express'
// 创建注册页面路由
const user = express.Router()

import type { UserTyle } from '../type'
import { selectDate } from '../utils/db'

// 匹配二级请求路径
user.get('/test', async (req, res) => {
   res.send('test ok!')
})

// 登录接口
user.post('/login', async(req, res) => {
   const { uname, password } = req.body
   const sql = `SELECT * FROM users WHERE uname='${uname}' AND password='${password}'`
   console.log(sql)
   try {
      const selectRes:Array<UserTyle>  = await selectDate(sql)
      if (selectRes.length > 0) {
         res.json({ msg: 'login:ok', data: selectRes })
      } else {
         res.json({ msg: 'login:failed', data: [] })
      }
   } catch (error: any) {
      console.error(`LOGIN SELECT ERROR:${error}`)
      res.end(error)
   }
})

export default user