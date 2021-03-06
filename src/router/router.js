import Main from '@/views/Main.vue';


// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component:resolve => void(require(['@/views/login.vue'],resolve)),// 懒加载 () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component:resolve => void(require(['@/views/error-page/404.vue'],resolve)),// 懒加载 () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component:resolve => void(require(['@/views/error-page/403.vue'],resolve)),// 懒加载 () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component:resolve => void(require(['@/views/error-page/500.vue'],resolve)),// 懒加载 () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component:resolve => void(require(['@/views/main-components/lockscreen/components/locking-page.vue'],resolve)),// 懒加载 () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => void(require(['@/views/home/home.vue'],resolve)),}, // 懒加载() => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component:resolve => void(require(['@/views/own-space/own-space.vue'],resolve)),}, // 懒加载 () => import('@/views/own-space/own-space.vue') },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/sim-manager',
    icon: 'ios-infinite',
    name: 'sim-manager',
    access: 0,
    title: '资产管理',
    component: Main,
    children: [
       { path: 'poolList', title: '流量池管理',access: 0, name: 'poolList', icon: 'link', component:resolve => void(require(['@/views/sim-manager/flowpool/poolList.vue'],resolve)),}, // 懒加载 () => import('@/views/sim-manager/flowpool/poolList.vue') },
     
      { path: 'simcard', title: 'SIM卡管理',access: 0, name: 'simcardTable', icon: 'link', component:resolve => void(require(['@/views/sim-manager/simcard/simcardTable.vue'],resolve)),}, // 懒加载 () => import('@/views/sim-manager/simcard/simcardTable.vue') },
      { path: 'simGroup', title: 'SIM卡分组',access: 0, name: 'simGroupTable', icon: 'link', component:resolve => void(require(['@/views/sim-manager/simGroup/simGroupTable.vue'],resolve)),},
    ]
  },
    {
        path: '/trade-manage',
        icon: 'ios-infinite',
        name: 'trade-manage',
        access: 0,
        title: '交易管理',
        component: Main,
        children: [
            { path: 'chargeHisTable', title: '流量加油包记录',access: 0, name: 'chargeHisTable', icon: 'link', component: resolve => void(require(['@/views/sim-manager/chargeHis/chargeHisTable.vue'],resolve)),}, // 懒加载() => import('@/views/sim-manager/chargeHis/chargeHisTable.vue') },
            { path: 'cus_orderTable', title: '订单管理',access: 0, name: 'cus_orderTable', icon: 'link', component:resolve => void(require(['@/views/customer-manager/cus_order/cus_orderTable.vue'],resolve)),}, // 懒加载 () => import('@/views/customer-manager/cus_order/cus_orderTable.vue') }
            { path: 'Cus_DepositOrderTable', title: '充值订单',access: 0, name: 'Cus_DepositOrderTable', icon: 'link', component:resolve => void(require(['@/views/customer-manager/Cus_DepositOrder/Cus_DepositOrderTable.vue'],resolve)),}, // 懒加载 () => import('@/views/customer-manager/Cus_DepositOrder/Cus_DepositOrderTable.vue') }
            { path: 'cus_pkg_orderTable', title: 'sim卡套餐订单',access: 0, name: 'cus_pkg_orderTable', icon: 'link', component:resolve => void(require(['@/views/customer-manager/cus_pkg_order/cus_pkg_orderTable.vue'],resolve)),},
            { path: 'cus_simstatus_orderTable', title: 'sim卡状态变更订单',access: 0, name: 'cus_simstatus_orderTable', icon: 'link', component:resolve => void(require(['@/views/customer-manager/cus_simstatus_order/cus_simstatus_orderTable.vue'],resolve)),},
        ]
    },
  {
    path: '/customer-manage',
    icon: 'ios-infinite',
    name: 'customer-manage',
    access: 0,
    title: '客户管理',
    component: Main,
    children: [
      { path: 'basic_infoTable', title: '客户资料',access: 0, name: 'basic_infoTable', icon: 'link', component: resolve => void(require(['@/views/customer-manager/basic_info/basic_infoTable.vue'],resolve)),}, // 懒加载 () => import('@/views/customer-manager/basic_info/basic_infoTable.vue') },

      { path: 'Cus_AccountDetailTable', title: '充值管理',access: 0, name: 'Cus_AccountDetailTable', icon: 'link', component:resolve => void(require(['@/views/customer-manager/Cus_AccountDetail/Cus_AccountDetailTable.vue'],resolve)),}, // 懒加载 () => import('@/views/customer-manager/Cus_AccountDetail/Cus_AccountDetailTable.vue') }

    ]
  },
    {
        path: '/alarm',
        icon: 'ios-infinite',
        name: 'alarm',
        access: 0,
        title: '预警管理',
        component: Main,
        children: [
            { path: 'taskTable', title: '任务列表',access: 0, name: 'taskTable', icon: 'link', component: resolve => void(require(['@/views/alarm/task/taskTable.vue'],resolve)),},
            { path: 'AlarmDetailTable', title: '告警日志',access: 0, name: 'AlarmDetailTable', icon: 'link', component: resolve => void(require(['@/views/alarm/alarmInfo/AlarmDetailTable.vue'],resolve)),},
        ]
    },
    {
        path: '/sim-message',
        icon: 'ios-infinite',
        name: 'sim-message',
        access: 0,
        title: '短信管理',
        component: Main,
        children: [
            { path: 'simMessageTable', title: '短信接发',access: 0, name: 'simMessageTable', icon: 'link', component: resolve => void(require(['@/views/sim-message/receive-and-send/simMessageTable.vue'],resolve)),},
        ]
    },
    {
        path: '/sys-manage',
        icon: 'ios-infinite',
        name: 'sys-manage',
        access: 0,
        title: '系统管理',
        component: Main,
        children: [
            { path: 'functionTable', title: '功能管理',access: 0, name: 'functionTable', icon: 'link', component:resolve => void(require(['@/views/sys-manage/function/functionTable.vue'],resolve)),}, // 懒加载 () => import('@/views/sys-manage/function/functionTable.vue') },
            { path: 'userTable', title: '用户管理', access: 0, name: 'userTable', icon: 'link', component: resolve => void(require(['@/views/sys-manage/user/userTable.vue'],resolve)),}, // 懒加载() => import('@/views/sys-manage/user/userTable.vue') },
            { path: 'roleTable', title: '角色管理', access: 0, name: 'roleTable', icon: 'link', component:  resolve => void(require(['@/views/sys-manage/role/roleTable.vue'],resolve)),}, // 懒加载() => import('@/views/sys-manage/role/roleTable.vue') }
            { path: 'logTable', title: '操作日志', access: 0, name: 'logTable', icon: 'link', component:  resolve => void(require(['@/views/sys-manage/log/logTable.vue'],resolve)),},
        ]
    },

  {
    path: '/sim-config',
    icon: 'ios-infinite',
    name: 'sim-config',
    access: 0,
    title: '资费管理',
    component: Main,
    children: [
      { path: 'expanseTable', title: '资费列表',access: 0, name: 'res-expanseconfig', icon: 'link', component: resolve => void(require(['@/views/sim-config/res-expanse/expanseTable.vue'],resolve)),},
    ]
  },
    {
        path: '/resource-config',
        icon: 'ios-infinite',
        name: 'resource-config',
        access: 0,
        title: '资源管理',
        component: Main,
        children: [
            { path: 'Res_OperatorTable', title: '运营商管理',access: 0, name: 'Res_OperatorTable', icon: 'link', component: resolve => void(require(['@/views/Operator/Res_Operator/Res_OperatorTable.vue'],resolve)),},
        ]
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
