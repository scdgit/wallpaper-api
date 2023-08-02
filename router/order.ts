import express from 'express'

// 创建注册页面路由
const order = express.Router()

import { selectDate, insertData, updateData } from '../utils/db'
import { checkParamsIsNull, checkToken } from '../middleware'

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
order.post('/errOrder', checkParamsIsNull, checkToken, (req, res) => {
   
})

export default order