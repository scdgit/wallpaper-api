export default {
   ip: "127.0.0.1",
   port: 5000,
   staticPath: '/public'
}

// 管理员账号
export const root = {
   unamer: 'root',
   password: '123456'
}

// session配置
export const SESSION_CONFIG = {
   secret: "scd-session-key", // 设置cookie的key的名字
   resave: false, // 每次请求是否重新保存会话
   saveUninitialized: true, // 是否保存未初始化的会话
   maxAge: 1000 * 60 * 60 * 24, // 设置有效期为一个小时
   httpOnly: true, // 仅服务端修改
   signed: true,// 签名cookie
}

// 设置token秘钥
export const TOKEN_KEY = 'scd-token-key'

// 数据库基本配置
export const dbconfig = {
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'wallpaper'
}

// 支付成功后的跳转地址
export const PAY_RETURN_URL = 'http://127.0.0.1:5173/#/subpackage/payment-res'
