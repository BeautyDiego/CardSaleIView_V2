import Cookies from 'js-cookie'

const user = {
  state: {},
  mutations: {
    logout (state, vm) {
      Cookies.remove('user')
      Cookies.remove('roleName')
      Cookies.remove('access')
      Cookies.remove('userId')
      sessionStorage.clear()
      // 恢复默认样式
      let themeLink = document.querySelector('link[name="theme"]')
      themeLink.setAttribute('href', '')
      // 清空打开的页面等数据，但是保存主题数据
      let theme = ''
      if (localStorage.theme) {
        theme = localStorage.theme
      }
      localStorage.clear()
      if (theme) {
        localStorage.theme = theme
      }
    },
    login (state, adminInfo) {
      sessionStorage.setItem('token', adminInfo.token)
      sessionStorage.setItem('menuList', JSON.stringify(adminInfo.menuList))
      Cookies.set('user', adminInfo.Name)
      Cookies.set('roleName', adminInfo.RoleName)
      Cookies.set('userId', adminInfo.Id)
    //  Cookies.set('menuList', JSON.stringify(adminInfo.menuList))
      Cookies.set('access', 0)
      state.adminInfo = adminInfo
        sessionStorage.setItem('adminInfo', JSON.stringify(adminInfo));
    },
    refresh(state){
        if (sessionStorage.getItem('adminInfo')){
            state.adminInfo = JSON.parse(sessionStorage.getItem('adminInfo'))
        }
    }
  }
}

export default user
