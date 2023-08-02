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

| 参数名   | 含义   | 类型   |
| -------- | ------ | ------ |
| uname    | 用户名 | string |
| password | 密码   | string |

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
  "id": 8,
  "code": 1,
  "msg": "注册成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJzY2QiLCJpYXQiOjE2OTA5OTE2ODF9.QwigfgFtiRwHjTOJzvuyjmcGvLFQVGHcmK26BoQf2sU",
  "avatar": "xxx/33.png",
  "nickname": "换胃思考",
  "userIntegral": 10
}
```

##### 登录用户

| 类型 | 接口        | 数据格式 |
| ---- | ----------- | -------- |
| POST | /user/login | JSON     |

请求参数
| 参数名 | 含义 | 类型 |
| ---- | ---------------- | -------- |
| uname | 用户名 | STRING |
| password | 密码 | STRING |

登陆成功

```json
{
  "msg": "欢迎回来",
  "id": 5,
  "uname": "root",
  "nickname": "筱糖豆﹥ε﹤",
  "avatar": "xxx/3.png",
  "userIntegral": 888,
  "email": "xxx@qq.com",
  "code": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJyb290IiwiaWF0IjoxNjkwODgwMjU5fQ.kKuLW57L5p28P-hgk9M29Wm6jH-GB-lKe2l4kxdBAbw"
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
| 参数名 | 含义 | 类型 |
| ---- | ---------------- | -------- |
| uId | 用户名 | NUMBER |

查询成功

```json
{
  "msg": "获取用户信息成功",
  "id": 5,
  "uname": "root",
  "nickname": "筱糖豆﹥ε﹤",
  "avatar": "xxx/3.png",
  "userIntegral": 888,
  "email": "xxx@qq.com",
  "code": 1
}
```

#### 积分模块(以下接口调用在请求头中传递Token做身份验证)

##### 获取用户积分

| 类型 | 接口              | 数据格式 |
| ---- | ----------------- | -------- |
| GET  | /user/getIntegral | JSON     |

请求参数
| 参数名 | 含义 | 类型 |
| ---- | ---------------- | -------- |
| uId | 用户ID | NUMBER |

获取成功

```json
{
  "msg": "积分信息获取成功",
  "userIntegral": 888,
  "code": 1
}
```

##### 更新用户积分

| 类型 | 接口                 | 数据格式 |
| ---- | -------------------- | -------- |
| POST | /user/updateIntegral | JSON     |

请求参数
| 参数名 | 含义 | 类型 |
| ---- | ---------------- | -------- |
| uId | 用户ID | NUMBER |
| userIntegral | 积分 | NUMBER |

更新成功

```json
{
  "msg": "积分添加成功",
  "code": 1
}
```

#### 订单模块(需传递Token)

##### 查询订单

| 类型 | 接口             | 数据格式 |
| ---- | ---------------- | -------- |
| GET  | /order/orderInfo | JSON     |

请求参数
| 参数名 | 含义 | 类型 |
| ---- | ---------------- | -------- |
| outTradeNo | 订单号 | STRING |

查询结果

```json
{
  "msg": "未找到该订单",
  "code": 0
}
```

#### 获取用户订单

| 类型 | 接口             | 数据格式 |
| ---- | ---------------- | -------- |
| POST | /order/userOrder | JSON     |

请求参数
| 参数名 | 含义 | 类型 |
| ---- | ---------------- | -------- |
| uId | 用户ID | NUMBER |

查询结果

```json
{
  "msg": "用户订单获取成功",
  "orders": [
    {
      "id": 17,
      "outTradeNo": "811fbee3-c8bc-4002-8c5f-f98b24370566",
      "uId": 5,
      "totalAmount": "5",
      "orderIntegral": 100,
      "orderTime": 20230802015113,
      "status": 1
    },
    {
      "id": 18,
      "outTradeNo": "1f0c5c13-ece9-429e-a1b6-4a9b79eaafb4",
      "uId": 5,
      "totalAmount": "5",
      "orderIntegral": 100,
      "orderTime": 20230802020333,
      "status": 0
    }
  ],
  "code": 1
}
```

#### 支付模块(需传递Token)

> 支付宝面支付

##### 生成支付订单

| 类型 | 接口              | 数据格式 |
| ---- | ----------------- | -------- |
| POST | /payment/inPerson | JSON     |

请求参数
| 参数名 | 含义 | 类型 |
| ---- | ---------------- | -------- |
| totalAmount | 订单金额 | STRING |
| orderIntegral | 订单积分 | NUMBER |
| uId | 用户ID | NUMBER |
| orderTime | 下单时间戳 | NUMBER |

成功返回结果

```json
{
  "alipay_trade_precreate_response": {
    "code": "10000",
    "msg": "Success",
    "out_trade_no": "6d541f02-c4e4-4962-a09b-1a7f19dfff92",
    "qr_code": "https://qr.alipay.com/bax01558ndriz1blqwu5001d"
  },
  "msg": "订单创建成功",
  "orderId": 39,
  "sign": "DXNiwv/8oXVMht/vd698k8Lw9bKDqooxQ1dltYJVC2LTrcsFtAWYH0adoQRDTF91BOG8m78myNL7fhf072nRmfz9wrWZmbZoG85kZBK58uu++UZV66A/YlyaH1L9ZTsa8NDROK/kk1jrNa32ttCC9jV7CYO/yUgoiOGx2S+8TRY+Dc7MElhZdnJG/Bqx9bHmDEGXnV98MTxUA4aMlUf6GyATvXaN9ly2MPXeDRhK/jmrOkrdjTsMpw09TvOARu/rMdnt8UR9/Oqp9MXF9x4JDsSbOTkIzGYdeiqgP6kXYxQ6tgfo+0ap/y4LIh8sE3AjKmtVWeQRsWJGWQAWxkezBA==",
  "orderIntegral": 100,
  "uId": 5
}
```

##### 解析支付订单

| 类型 | 接口                | 数据格式 |
| ---- | ------------------- | -------- |
| POST | /payment/queryOrder | JSON     |

请求参数
| 参数名 | 含义 | 类型 |
| ---- | ---------------- | -------- |
| outTradeNo | 订单号 | STRING |
| orderIntegral | 订单积分 | NUMBER |
| uId | 用户ID | NUMBER |

成功的返回

```json
{
  "msg": "交易支付成功",
  "queryData": {
    "code": "10000",
    "msg": "Success",
    "buyer_logon_id": "hod***@sandbox.com",
    "buyer_pay_amount": "5.00",
    "buyer_user_id": "2088722005138172",
    "buyer_user_type": "PRIVATE",
    "fund_bill_list": [
      {
        "amount": "5.00",
        "fund_channel": "ALIPAYACCOUNT"
      }
    ],
    "invoice_amount": "5.00",
    "out_trade_no": "b28c4f6d-eec0-4d09-94eb-113c5197d9d7",
    "point_amount": "0.00",
    "receipt_amount": "5.00",
    "send_pay_date": "2023-08-02 22:24:35",
    "total_amount": "5.00",
    "trade_no": "2023080222001438170500753871",
    "trade_status": "TRADE_SUCCESS"
  },
  "code": "10000",
  "status": "TRADE_SUCCESS"
}
```
