import express from 'express'
// 创建注册页面路由
const user = express.Router()

import type { UserTyle } from '../type'
import { selectDate, insertData } from '../utils/db'
import { unameCheck, passwordCheck } from '../utils/check'

// 匹配二级请求路径
user.get('/test', async (req, res) => {
   res.send('test ok!')
})

// 登录接口
user.post('/login', async(req, res) => {
   const { uname, password } = req.body
   const sql = `SELECT * FROM users WHERE uname='${uname}' AND password='${password}'`
   try {
      const selectRes:Array<UserTyle>  = await selectDate(sql)
      if (selectRes.length > 0) {
         res.json({ msg: 'login:ok', data: selectRes[0], code: 1 })
      } else {
         res.json({ msg: 'login:failed', data: null, code: 0 })
      }
   } catch (error: any) {
      console.error(`LOGIN SELECT ERROR:${error}`)
      res.end(error)
   }
})

// 注册接口
user.post('/register', (req, res) => {
   const { uname, password } = req.body
   // 用户名校验
   if (!unameCheck(uname)) return res.json({msg: '用户名不符合规范', code: 0})
   // 密码校验
   if (!passwordCheck(password)) return res.json({msg: '密码不符合规范', code: 0})
   // 重名校验
   const sql = `SELECT * FROM users WHERE uname='${uname}'`
   selectDate(sql).then(async search => {
      try {
         if (search.length >= 1) return res.json({ msg: '该用户名已被注册', code: 0 })
         const data = await insertData('users', { uname, password })
         res.json({data, code: 1})
      } catch(err) {
         res.json(err)
      }
   }).catch(err => res.json(err))
})

export default user