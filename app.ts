import express from 'express'
import routes from './router' // 路由
import bodyParser from 'body-parser'
import session from 'express-session'
const app = express()

import { SESSION_CONFIG } from './config'

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session(SESSION_CONFIG))

// 启动
import config from './config'
app.listen(config.port, config.ip, async () => {
   console.log(`App is running at http://localhost:${config.port}`)
   routes(app)
})