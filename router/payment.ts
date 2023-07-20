import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

// 创建注册页面路由
const payment = express.Router()

import { alipaySdk } from '../utils/alipay'

// 发起支付宝的h5支付
payment.post('/h5', async (req, res) => {
   const orderId = uuidv4()
   const bizContent = {
      out_trade_no: orderId, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
      product_code: 'FAST_INSTANT_TRADE_PAY', // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
      total_amount: '0.01', // 订单总金额，单位为元，精确到小数点后两位
      subject: '色彩墙', // 订单标题
      body: '商品详情', // 订单描述
   }
   const result = alipaySdk.pageExec('alipay.trade.wap.pay', {
      method: 'GET',
      bizContent,
      returnUrl: 'http://127.0.0.1:5173/#/subpackage/payment-res'
   })
   res.json({ url: result })
})

// 解析支付订单状态
payment.post('/queryOrder', async (req, res) => {
   const { out_trade_no, trade_no } = req.body
   const bizContent = { out_trade_no, trade_no }
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
               res.json({ msg: '交易创建，等待买家付款' })
               break
            case 'TRADE_CLOSED':
               res.json({ msg: '未付款交易超时关闭，或支付完成后全额退款' })
               break
            case 'TRADE_SUCCESS':
               res.json({ msg: '交易支付成功', queryData })
               break
            case 'TRADE_FINISHED':
               res.json({ msg: '交易结束，不可退款' })
               break
            default: res.end();
         }
      } else if (code === '40004') {
         res.json({ msg: '业务处理失败' })
      } else {
         res.json({ msg: '请根据文档：https://opendoc.alipay.com/common/02km9f中的code码查阅相关信息！' })
      }
   } catch (err) {
      res.json({ msg: '查询失败', err })
   }
})

export default payment