import { Express, Request, Response, Router } from 'express'

// 路由配置接口
interface RouterConf {
  path: string,
  router: Router,
  meta?: any
}

// 路由配置
import user from './user'
import payment from './payment'
const routerConf: Array<RouterConf> = [
   { path: '/user', router: user },
   { path: '/payment', router: payment }
]

function routes(app: Express) {
  // 根目录
  app.get('/', (req: Request, res: Response) => res.status(200).send('Hello Shinp!!!'))
  routerConf.forEach((conf) => app.use(conf.path, conf.router))
}

export default routes