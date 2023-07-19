## 壁纸应用接口

#### 基础命令

```bash
# 运行
npm run dev
```

#### 接口配置

主机：127.0.0.1

端口：5000

测试接口：127.0.0.1:5000/user/test

#### 技术选型

Express + TS + MySql

#### 用户模块

##### 登录用户

| 类型 | 接口        | 数据格式 |
| ---- | ----------- | -------- |
| POST | /user/login | JSON     |

请求参数

```json
{
    "uname":"root",
    "password":"123456"
}
```

响应数据

```json
// 登录成功
{
    "msg": "login:ok",
    "data": [
        {
            "id": 1,
            "Uname": "root",
            "Password": "123456"
        }
    ]
}
// 登录失败
{
    "msg": "login:failed",
    "data": []
}
```



#### 商品模块