import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

// 创建注册页面路由
const payment = express.Router()

import { PAY_RETURN_URL } from '../config'
import { alipaySdk } from '../utils/alipay'
import { checkParamsIsNull, checkToken } from '../middleware'
import { insertData, selectDate, updateData } from '../utils/db'

// 发起支付宝的h5支付
payment.post('/h5', checkParamsIsNull, checkToken, async (req, res) => {
   const { totalAmount } = req.body
   const orderId = uuidv4()
   const bizContent = {
      out_trade_no: orderId, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
      product_code: 'FAST_INSTANT_TRADE_PAY', // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
      total_amount: totalAmount, // 订单总金额，单位为元，精确到小数点后两位
      subject: '积分充值', // 订单标题
      body: '商品详情', // 订单描述
   }
   const result = alipaySdk.pageExec('alipay.trade.wap.pay', {
      method: 'GET',
      bizContent,
      returnUrl: PAY_RETURN_URL
   })
   res.json({ url: result })
})

// 发起支付宝的当面付
payment.post('/inPerson', checkParamsIsNull, checkToken, (req, res) => {
   const { totalAmount, orderIntegral, uId, orderTime } = req.body
   const outTradeNo = uuidv4() // 订单号
   const bizContent = {
      out_trade_no: outTradeNo, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
      total_amount: totalAmount, // 订单总金额，单位为元，精确到小数点后两位
      subject: '积分充值', // 订单标题
   }
   const resultUrl = alipaySdk.pageExec('alipay.trade.precreate', {
      method: 'GET',
      bizContent
   })
   axios.get(resultUrl).then(resultData => {
      // 创建订单记录
      insertData('orders', { outTradeNo, uId, totalAmount, orderIntegral, orderTime }).then(insertId => {
         res.json({ ...resultData.data, msg: '订单创建成功', orderIntegral, uId, orderId: insertId })
      }).catch(err => {
         console.error(err)
         res.status(400).json({ msg: '数据库订单生成失败', code: 0 })
      })
   }).catch(err => {
      res.json({ msg: '订单创建失败', err })
   })
})

// 解析支付订单状态
payment.post('/queryOrder', checkParamsIsNull, checkToken, async (req, res) => {
   const { outTradeNo, orderIntegral, uId } = req.body
   const bizContent = { outTradeNo }
   const resultData = alipaySdk.pageExec('alipay.trade.query', {
      method: 'GET',
      bizContent
   })
   try {
      // 查询订单结果
      const queryRes = await axios.get(resultData)
      const queryData = queryRes.data.alipay_trade_query_response
      const { code, trade_status } = queryData
      if (code === '10000') {
         switch (trade_status) {
            case 'WAIT_BUYER_PAY':
               res.json({ msg: '交易创建，等待买家付款', code, status: trade_status })
               break
            case 'TRADE_CLOSED':
               res.json({ msg: '未付款交易超时关闭，或支付完成后全额退款', code, status: trade_status })
               break
            case 'TRADE_SUCCESS':
               // 修改数据库订单状态
               try {
                  await updateData('orders', { status: 1 }, `outTradeNo='${outTradeNo}'`)
                  const oldTotalIntegral = await selectDate(`SELECT userIntegral FROM users WHERE id='${uId}'`)
                  const newIntegral = orderIntegral + oldTotalIntegral[0].userIntegral
                  await updateData('users', { userIntegral: newIntegral }, `id=${uId}`)
                  res.json({ msg: '交易支付成功', queryData, code, status: trade_status })
               } catch(err) {
                  console.error(err)
                  res.status(500).json({ msg: '服务器错误，请申请售后服务', code: 0 })
               }
               break
            case 'TRADE_FINISHED':
               res.json({ msg: '交易结束，不可退款', code, status: trade_status })
               break
            default: res.end();
         }
      } else if (code === '40004') {
         res.json({ msg: '业务处理失败', code })
      } else {
         res.json({ msg: '请根据文档：https://opendoc.alipay.com/common/02km9f中的code码查阅相关信息！', code })
      }
   } catch (err) {
      res.json({ msg: '查询失败', err })
   }
})

export default payment