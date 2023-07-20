/**
 * 对接支付宝 H5 支付
 */
import AlipaySdk from 'alipay-sdk' // 引入SDK
import { APP_PRIVATE_KEY, ALIPAY_PUBLIC_KEY } from '../config/payment-key'

export const alipaySdk = new AlipaySdk({
   appId: '9021000123611250',
   keyType: 'PKCS8', // node版本需要配置这个，否则会出现支付地址获取不到等问题
   signType: 'RSA2', // 签名算法,默认 RSA2
   gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do', // 支付宝网关地址 ，沙箱环境下使用时需要修改
   alipayPublicKey: ALIPAY_PUBLIC_KEY, // 支付宝公钥
   privateKey: APP_PRIVATE_KEY // 应用私钥
})