## 魔法研究所-应用接口

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

##### 注册用户

| 类型 | 接口           | 数据格式 |
| ---- | -------------- | -------- |
| POST | /user/register | JSON     |

请求参数

```json
{
  "uname": "xxx",
  "password": "xxx"
}
```

注册失败

```json
{
  "msg": "该用户名已被注册",
  "code": 0
}
```

注册成功

```json
{
  "msg": "注册成功",
  "insertId": 3,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJyb290IiwiaWF0IjoxNjkwMjY4NjcyfQ.rQ1Qnk63pIGBWwrN3NBrSsime5Chrek83OjkHjrfPSw",
  "code": 1
}
```

##### 登录用户

| 类型 | 接口        | 数据格式 |
| ---- | ----------- | -------- |
| POST | /user/login | JSON     |

请求参数

```json
{
  "uname": "xxx",
  "password": "xxx"
}
```

登陆成功

```json
{
  "msg": "欢迎回来",
  "id": 1,
  "uname": "xxx",
  "nickname": "aikun",
  "avaatr": "/avatar/default.png",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJyb290IiwiaWF0IjoxNjkwMjY4NjcyfQ.rQ1Qnk63pIGBWwrN3NBrSsime5Chrek83OjkHjrfPSw",
  "code": 1
}
```

登陆失败

```json
{
  "msg": "用户名密码错误",
  "code": 0
}
```

##### 获取用户信息

| 类型 | 接口           | 数据格式 |
| ---- | -------------- | -------- |
| GET  | /user/userinfo | JSON     |

请求头设置Token(登录/注册成功后获取)

```txt
headers.authorization = `Bearer ${token}`
```

请求参数

```json
{
  "uname": "xxx"
}
```

查询成功

```json
{
  "msg": "获取用户信息成功",
  "id": 1,
  "uname": "xxx",
  "nickname": "aikun",
  "avaatr": "/avatar/default.png",
  "code": 1
}
```

#### 积分模块

##### 获取用户积分

| 类型 | 接口           | 数据格式 |
| ---- | -------------- | -------- |
| GET  | /user/integral | JSON     |

请求头设置Token

```txt
headers.authorization = `Bearer ${token}`
```

请求参数

```json
{
  "uname": "xxx"
}
```

获取成功

```json
{
  "msg": "积分信息获取成功",
  "integral": 888,
  "code": 1
}
```

##### 更新用户积分

| 类型 | 接口                 | 数据格式 |
| ---- | -------------------- | -------- |
| POST | /user/updateIntegral | JSON     |

请求头设置Token

```txt
headers.authorization = `Bearer ${token}`
```

请求参数

```json
{
  "uname": "xxx",
  "integral": 80
}
```

更新成功

```json
{
  "msg": "积分添加成功",
  "code": 1
}
```

#### 支付模块

##### H5支付-支付宝支付

1.安装支付宝 SDK：npm install alipay-sdk
