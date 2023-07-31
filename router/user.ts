import express from 'express'
import jwt from 'jsonwebtoken'

// 创建注册页面路由
const user = express.Router()

import type { UserTyle } from '../type'
import { selectDate, insertData, updateData } from '../utils/db'
import { unameCheck, passwordCheck } from '../utils/check'
import { TOKEN_KEY } from '../config'
import { randomAvatar, randomNickname } from '../utils'
import { checkToken } from '../middleware/user'

// 匹配二级请求路径
user.get('/test', async (req, res) => {
   res.send('test ok!')
})

// 登录接口
user.post('/login', async (req: any, res) => {
   const { uname, password } = req.body
   const sql = `SELECT * FROM users WHERE uname='${uname}'`
   try {
      const selectRes: Array<UserTyle> = await selectDate(sql)
      if (selectRes.length > 0) {
         if (selectRes[0].password === password) {
            req.session.uname = uname // 存储一个session记录
            const user = { id: 1, username: uname }
            const token = jwt.sign(user, TOKEN_KEY)
            res.json({ msg: '登录成功', ...selectRes[0], code: 1, token })
         } else res.json({ msg: '用户名密码错误', code: 0 })
      } else {
         res.json({ msg: '该用户未注册', code: 0 })
      }
   } catch (error) {
      console.error(`LOGIN SELECT ERROR:${error}`)
      res.end(error)
   }
})

// 注册接口
user.post('/register', (req: any, res) => {
   const { uname, password, email } = req.body
   // 用户名校验
   if (!unameCheck(uname)) return res.json({ msg: '用户名不符合规范', code: 0 })
   // 密码校验
   if (!passwordCheck(password)) return res.json({ msg: '密码不符合规范', code: 0 })
   // 重名校验
   const sql = `SELECT * FROM users WHERE uname='${uname}'`
   selectDate(sql).then(async search => {
      try {
         if (search.length >= 1) return res.json({ msg: '该用户名已被注册', code: 0 })
         const avatar = randomAvatar()
         const nickname = randomNickname()
         const data: any = await insertData('users', { uname, password, email, avatar, nickname })
         req.session.uname = uname // 存储一个session记录
         const user = { id: 1, username: uname }
         const token = jwt.sign(user, TOKEN_KEY)
         res.json({ ...data, code: 1, msg: '注册成功', token, avatar, nickname, integral: 10 })
      } catch (err) {
         res.json(err)
      }
   }).catch(err => res.json(err))
})

// 获取用户信息
user.get('/userinfo', checkToken, (req, res) => {
   const { uname } = req.query
   if (!uname) return res.json({ msg: '用户名格式错误', code: 0 })
   const sql = `SELECT * FROM users WHERE uname='${uname}'`
   selectDate(sql).then(searchRes => {
      res.json({ msg: '获取用户信息成功', ...searchRes[0], code: 1 })
   }).catch(err => {
      res.json({ msg: '数据库未连接', code: 0 })
   })
})

// 获取积分信息
user.get('/integral', checkToken, (req, res) => {
   const { uname } = req.query
   const sql = `SELECT integral FROM users WHERE uname='${uname}'`
   console.log(sql)
   selectDate(sql).then(searchRes => {
      if (searchRes.length > 0) {
         res.json({ msg: '积分信息获取成功', integral: searchRes[0].integral, code: 1 })
      } else {
         res.json({ msg: '未找到该用用户', code: 0 })
      }
   }).catch(err => {
      console.error(err)
      res.status(500).json({ msg: '服务器错误', code: 0 })
   })
})

// 更新用户积分
user.post('/updateIntegral', checkToken, (req, res) => {
   const { uname, integral } = req.body
   if (!Number(integral)) return res.status(400).json({ msg: '积分格式错误', code: 0 })
   updateData('users', { integral }, `uname='${uname}'`).then(updateRes => {
      console.log(updateRes)
      if (updateRes >= 1) res.json({ msg: '积分添加成功', code: 1 })
      else res.status(400).json({ msg: '积分添加失败', code: 0 })
   }).catch((err) => {
      console.error(err)
      res.status(500).json({ msg: '服务器错误', code: 0 })
   })
})

export default user