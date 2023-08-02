import express from 'express'
import jwt from 'jsonwebtoken'

// 创建注册页面路由
const user = express.Router()

import type { UserTyle } from '../type'
import { selectDate, insertData, updateData } from '../utils/db'
import { unameCheck, passwordCheck } from '../utils/check'
import { TOKEN_KEY } from '../config'
import { randomAvatar, randomNickname } from '../utils'
import { checkParamsIsNull, checkToken } from '../middleware'

// 匹配二级请求路径
user.get('/test', async (req, res) => {
   res.send('test ok!')
})

// 登录接口
user.post('/login', checkParamsIsNull, async (req: any, res) => {
   const { uname, password } = req.body
   const sql = `SELECT * FROM users WHERE uname='${uname}'`
   try {
      const selectRes: Array<UserTyle> = await selectDate(sql)
      if (selectRes.length > 0) {
         if (selectRes[0].password === password) {
            req.session.uname = uname // 存储一个session记录
            const user = { id: 1, username: uname }
            const token = jwt.sign(user, TOKEN_KEY)
            delete selectRes[0].password
            res.json({ msg: '欢迎回来', ...selectRes[0], code: 1, token })
         } else res.json({ msg: '用户名密码错误', code: 0 })
      } else {
         res.json({ msg: '该用户未注册', code: 0 })
      }
   } catch (error) {
      res.end(error)
   }
})

// 注册接口
user.post('/register', checkParamsIsNull, (req: any, res) => {
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
         const insertId = await insertData('users', { uname, password, email, avatar, nickname })
         req.session.uname = uname // 存储一个session记录
         const user = { id: 1, username: uname }
         const token = jwt.sign(user, TOKEN_KEY)
         res.json({ id: insertId, code: 1, msg: '注册成功', token, avatar, nickname, userIntegral: 10 })
      } catch (err) {
         res.json(err)
      }
   }).catch(err => res.json(err))
})

// 获取用户信息
user.get('/userinfo', checkParamsIsNull, checkToken, (req, res) => {
   const { uId } = req.query
   const sql = `SELECT * FROM users WHERE id='${uId}'`
   selectDate(sql).then(searchRes => {
      delete searchRes[0].password
      res.json({ msg: '获取用户信息成功', ...searchRes[0], code: 1 })
   }).catch(err => {
      res.status(500).json({ msg: '服务器错误', code: 0 })
   })
}) 

// 获取积分信息
user.get('/getIntegral', checkParamsIsNull, checkToken, (req, res) => {
   const { uId } = req.query
   const sql = `SELECT userIntegral FROM users WHERE id='${uId}'`
   selectDate(sql).then(searchRes => {
      if (searchRes.length > 0) {
         res.json({ msg: '积分信息获取成功', ...searchRes[0], code: 1 })
      } else {
         res.json({ msg: '未找到该用用户', code: 0 })
      }
   }).catch(err => {
      res.status(500).json({ msg: '服务器错误', code: 0 })
   })
})

// 更新用户积分
user.post('/updateIntegral', checkParamsIsNull, checkToken, (req, res) => {
   const { uId, userIntegral } = req.body
   if (!Number(userIntegral)) return res.status(400).json({ msg: '积分格式错误', code: 0 })
   updateData('users', { userIntegral }, `id='${uId}'`).then(updateRes => {
      if (updateRes >= 1) res.json({ msg: '积分添加成功', code: 1 })
      else res.status(400).json({ msg: '积分添加失败', code: 0 })
   }).catch((err) => {
      res.status(500).json({ msg: '服务器错误', code: 0 })
   })
})

// 查看广告+15积分
user.post('/lookAdd', checkParamsIsNull, checkToken, async (req, res) => {
   const { uId, isFinish } = req.body
   if (!isFinish) return res.json({ msg: '广告未看完', code: 0 })
   const sql = `SELECT integral FROM users WHERE id='${uId}'`
   const selecRes = await selectDate(sql)
   if (selecRes.length > 0) {
      try {
         await updateData('users', { integral: selecRes[0].integral + 15 }, `id=${uId}`)
         res.json({ msg: '奖励获取成功', code: 1 })
      } catch(err) {
         res.status(500).json({ msg: '服务器错误', code: 0 })
      }
   } else {
      res.status(400).json({ msg: '未找到该用户，请确保已注册', code: 0 })
   }
})

export default user