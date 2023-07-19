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

##### 注册用户

| 类型 | 接口           | 数据格式 |
| ---- | -------------- | -------- |
| POST | /user/register | JSON     |

请求参数：

```json
{
  "uname": "root",
  "password": "scD869911"
}
```

注册失败：

```json
{
  "msg": "该用户名已被注册",
  "code": 0
}
```

注册成功：

```json
{
  "msg": "insert:ok",
  "insertId": 3,
  "code": 1
}
```

##### 登录用户

| 类型 | 接口        | 数据格式 |
| ---- | ----------- | -------- |
| POST | /user/login | JSON     |

请求参数：

```json
{
  "uname": "root",
  "password": "scD869911"
}
```

登陆成功：

```json
{
  "msg": "login:ok",
  "data": {
    "id": 1,
    "uname": "root",
    "password": "scD869911",
    "nickname": "aikun",
    "avaatr": "/avatar/default.png"
  },
  "code": 1
}
```

登陆失败：

```json
{
  "msg": "login:failed",
  "data": null,
  "code": 0
}
```

#### 商品模块
