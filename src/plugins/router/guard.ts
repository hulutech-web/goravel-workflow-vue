import { useTitle } from '@vueuse/core'
import config from '@/config'

let isInit = false
export default (router: Router) => {
  router.beforeEach(beforeEach)
}

//路由守卫
async function beforeEach(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  await init()
  const { isLogin } = useAuth()
  const storage = useStorage()

  if (to.meta.auth && !isLogin()) {
    storage.set(CacheEnum.REDIRECT_ROUTE_NAME, to.fullPath)
    return { name: RouteEnum.LOGIN }
  }

  if (to.meta.guest && isLogin()) return '/auth/login'
  if (to.meta.title) useTitle(to.meta.title)
}

//初始应用
async function init() {
  if (isInit === true) return
  isInit = true
  // await Promise.all(config.middleware.map((middleware) => middleware()))
}
