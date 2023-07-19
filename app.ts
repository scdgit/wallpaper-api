import express from 'express'
import routes from './router' // 路由
import bodyParser from 'body-parser'

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 启动
import config from './config'
app.listen(config.port, config.ip, async () => {
   console.log(`App is running at http://localhost:${config.port}`)
   routes(app)
})