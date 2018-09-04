/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = 'http://localhost:5883'
let frontWebUrl = 'http://localhost:8080'

if (process.env.NODE_ENV === 'production') {
   // baseUrl = 'http://www.chaodawulian.com:8002'
   // frontWebUrl = 'http://www.chaodawulian.com'
    baseUrl = 'http://ss.hbbdmc.com:8002'
    frontWebUrl = 'http://ss.hbbdmc.com'
}


export {
  frontWebUrl,
  baseUrl
}
