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
   key: "key", // 设置cookie的key的名字
   maxAge: 1000 * 60 * 60 * 1, // 设置有效期为一个小时
   httpOnly: true, // 仅服务端修改
   signed: true,// 签名cookie
}

// 数据库基本配置
export const dbconfig = {
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'wallpaper'
}