import express from 'express'

// 创建注册页面路由
const order = express.Router()

import { selectDate, insertData, updateData } from '../utils/db'
import { checkParamsIsNull, checkToken } from '../middleware'
import { validateOrderNumber } from '../utils/check'

// 查询订单
order.get('/orderInfo', checkParamsIsNull, checkToken, (req, res) => {
   const { outTradeNo } = req.query
   const sql = `SELECT * FROM orders WHERE outTradeNo='${outTradeNo}'`
   selectDate(sql).then(orderInfo => {
      if (orderInfo.length === 1) res.json({ msg: '查询成功', ...orderInfo[0], code: 1 })
      else if (orderInfo.length > 1) res.json({ msg: '有多个重复订单', code: 0 })
      else res.json({ msg: '未找到该订单', code: 0 })
   }).catch(() => {
      res.status(500).json({ msg: '服务器错误', code: 0 })
   })
})

// 获取用户订单
order.post('/userOrder', checkParamsIsNull, checkToken, (req, res) => {
   const { uId } = req.body
   const sql = `SELECT * FROM orders WHERE uId='${uId}'`
   selectDate(sql).then(searchRes => {
      res.json({ mes: '用户订单获取成功', orders: searchRes, code: 0 })
   }).catch(err => {
      console.error(err)
      res.status(500).json({ msg: '服务器错误', code: 0 })
   })
})

// 新增异常订单[客户端申请订单异常]
order.post('/addErrOrder', checkParamsIsNull, checkToken, async (req, res) => {
   const { outTradeNo } = req.body
   if (!validateOrderNumber(outTradeNo)) return res.status(400).json({ msg: '输入的订单号有误', code: 0 })
   const sql1 = `SELECT outTradeNo FROM err_order WHERE outTradeNo='${outTradeNo}'`
   const errOrder = await selectDate(sql1)
   if (errOrder.length > 0) return res.json({ msg: '不能重复提交申请', code: 0 })
   const sql2 = `SELECT * FROM orders WHERE outTradeNo='${outTradeNo}'`
   selectDate(sql2).then(async (selectRes) => {
      if (selectRes.length === 1) {
         if (selectRes[0].status === 1) return res.json({ msg: '该订单已完成，无法申请提交！', code: 0 })
         delete selectRes[0].id
         try {
            // 新增错误订单进数据库
            const insertId = await insertData('err_order', { ...selectRes[0] })
            if (insertId) {
               res.json({ msg: '申请成功', code: 1 })
            } else {
               res.status(500).json({ msg: '服务器错误，请稍后再试', code: 0 })
            }
         } catch (err) {
            console.error(err)
            res.status(500).json({ msg: '服务器错误，请稍后再试', code: 0 })
         }
      } else {
         res.status(400).json({ msg: '该订单不存在，请检查订单号是否正确！', code: 0 })
      }
   })
})

export default order