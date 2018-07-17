import fetch from './fetch'

/**
 * 登陆
 */

export const login = data => fetch('/Account/Login', data, 'POST');
/**
 * 退出
 */
export const logout = data => fetch('/Account/Logout', data, 'POST');

export const editUserPwd = data => fetch('/Sys_Users/EditPwd_Web_User', data, 'POST');

/**
 * 获取所有一级菜单
 */
export const functionTreeGrid = data => fetch('/Sys_Function/GetList', data, 'POST');
/**
 * 获取所有一级菜单
 */
export const parentFunctionList = data => fetch('/Sys_Function/GetParentFunction', data, 'POST');
/**
 *  * 获取余额
 */
export const GetCustomer = data => fetch('/Cus_Customer/Get_Cus_Customer', data, 'POST');
/**

 * 添加菜单
 */
export const addFunction = data => fetch('/Sys_Function/Add_Sys_Function', data, 'POST');
/**
 * 修改菜单
 */
export const editFunction = data => fetch('/Sys_Function/Edit_Sys_Function', data, 'POST');
/**
 * 修改菜单
 */
export const delFunction = data => fetch('/Sys_Function/Delete_Sys_Function', data, 'POST');
/**
 * 获取按钮权限list
 */
export const actionList = data => fetch('/Sys_Function/GetRbacAction', data, 'POST');
/**
 * 添加按钮
 */
export const addAction = data => fetch('/Sys_Function/Add_Rbac_Action', data, 'POST');
/**
 * 修改按钮
 */
export const editAction = data => fetch('/Rbac_Function/Update_Rbac_Action', data, 'POST');
/**
 * 获取按钮权限list
 */
export const rolePagedList = data => fetch('/Sys_Role/List_Sys_Role', data, 'POST');
/**
 * 添加角色
 */
export const addRole = data => fetch('/Sys_Role/Add_Sys_Role', data, 'POST');
/**
 * 修改角色
 */
export const editRole = data => fetch('/Sys_Role/Edit_Sys_Role', data, 'POST');
/**
 * 删除角色
 */
export const delRole = data => fetch('/Sys_Role/Delete_Sys_Role', data, 'POST');
/**
 * 获取权限树
 */
export const roleTree = data => fetch('/Sys_Role/RoleTree', data, 'POST');
/**
 * 设置权限树
 */
export const setRoleTree = data => fetch('/Sys_Role/SetRoleTree', data, 'POST');
/**
 * 角色普通下拉框
 */
export const roleComboList = data => fetch('/Sys_Role/GetComboList', data, 'POST');
/**
 * 获取操作日志list
 */
export const operationLogPagedList = data => fetch('/OperationLog/List_OperationLog', data, 'POST');
/**
 * 省combo
 */
export const provinceCombo = data => fetch('/Department/GetProvinces', data, 'POST');
/**
 * 市combo
 */
export const cityCombo = data => fetch('/Department/GetCities', data, 'POST');
/**
 * 区combo
 */
export const districtCombo = data => fetch('/Department/GetDistrict', data, 'POST');
/**
 * 部门combo
 */
export const deptTreeCombo = data => fetch('/Department/GetComboTree', data, 'POST');
/**
 * 获取用户list
 */
export const userPagedList = data => fetch('/Sys_Users/List_Sys_Users', data, 'POST');
/**
 * 添加用户
 */
export const addUser = data => fetch('/Sys_Users/Add_Sys_Users', data, 'POST');
/**
 * 修改用户
 */
export const editUser = data => fetch('/Sys_Users/Edit_Sys_Users', data, 'POST');
/**
 * 删除用户
 */
export const delUser = data => fetch('/Sys_Users/Delete_Sys_Users', data, 'POST');
/**
 * 用户密码重置
 */
export const resetUserPwd = data => fetch('/Sys_Users/ResetPwd_Web_User', data, 'POST');


//  region 客户管理

export const customerBasicInfoList = data => fetch('/Cus_Customer/List_Cus_Customer', data, 'POST');
export const addCustomer = data => fetch('/Cus_Customer/Add_Cus_Customer', data, 'POST');
export const editCustomer = data => fetch('/Cus_Customer/Edit_Cus_Customer', data, 'POST');
export const delCustomer = data => fetch('/Cus_Customer/Delete_Cus_Customer', data, 'POST');
export const getDiscount = data => fetch('/Cus_Discount/List_Cus_Discount', data, 'POST');
export const addCusDiscount = data => fetch('/Cus_Discount/Add_Cus_Discount', data, 'POST');
export const getExpensesList = data => fetch('/Res_Expenses/ListAll_Res_Expenses', data, 'POST');


//   endregion

//  region SIM管理

//流量池管理
export const poolListPage = data => fetch('/Cus_FlowPool/List_Cus_FlowPool', data, 'POST');
export const queryPoolUsed = data => fetch('/Cus_FlowPool/QueryPoolUsed', data, 'POST');
export const queryRechargePrice = data => fetch('/Cus_FlowPool/QueryRechargePrice', data, 'POST');
export const addReChargeOrder = data => fetch('/Cus_ReChargeOrder/Add_Cus_ReChargeOrder', data, 'POST');

export const getReChargeWeChatQRCode = data => fetch('/Cus_ReChargeOrder/Get_ReChargeWx_QRCode', data, 'POST');
export const getReChargeAliQRCode = data => fetch('/Cus_ReChargeOrder/Get_Alipay_QRCode', data, 'POST');
export const reChargeHistory = data => fetch('/Cus_ReChargeOrder/List_Cus_ReChargeOrder', data, 'POST');
export const cancelChargeOrder = data => fetch('/Cus_ReChargeOrder/Cancel_Cus_ReChargeOrder', data, 'POST');
export const delChargeOrder = data => fetch('/Cus_ReChargeOrder/Delete_Cus_ReChargeOrder', data, 'POST');
export const remitChargeOrder = data => fetch('/Cus_ReChargeOrder/Remit_Cus_ReChargeOrder', data, 'POST');
export const comfirmChargeOrder = data => fetch('/Cus_ReChargeOrder/Comfirm_Cus_ReChargeOrder', data, 'POST');  // 已付款订单 完成订单
//sim卡
export const simcardListPage = data => fetch('/Sim_SimCard/List_Sim_SimCard', data, 'POST');
export const editSimcard = data => fetch('/Sim_SimCard/Edit_Sim_SimCard', data, 'POST');
//export const getSimCardDetail = data => fetch('/Sim_SimCard/Get_Sim_SimCard_Detail', data, 'POST');
export const getSimCardDetail = data => fetch('/APICore/SimSingleQuery', data, 'POST');

// SIM卡分组
export const simGroupListPage = data => fetch('/Sim_Group/List_Sim_Group', data, 'POST');
export const addSimGroup = data => fetch('/Sim_Group/Add_Sim_Group', data, 'POST');
export const editSimGroup = data => fetch('/Sim_Group/Edit_Sim_Group', data, 'POST');
export const delSimGroup = data => fetch('/Sim_Group/Delete_Sim_Group', data, 'POST');
export const simcardTransferListPage = data => fetch('/Sim_Group/List_Sim_SimCard_Transfer', data, 'POST');
export const simGroupSimCardList = data => fetch('/Sim_Group/List_Sim_Group_SimCard', data, 'POST');
export const addSimToGroup = data => fetch('/Sim_Group/Add_SimCard_To_Group', data, 'POST');
export const getUnGroupPoolList = data => fetch('/Cus_FlowPool/Get_UnGroupFlowPoolList', data, 'POST');
export const groupBindPool = data => fetch('/Sim_Group/SimGroup_Bind_Pool', data, 'POST');
export const customerCombo = data => fetch('/Cus_Customer/Cus_Customer_Combo', data, 'POST');
export const groupToCustomer = data => fetch('/Sim_Group/Group_To_Customer', data, 'POST');
//   endregion


//  region 客户订单
export const simExpanseConfigList = data => fetch('/Sim_FreeExpenseConfig/List_Sim_ExpenseConfig', data, 'POST');
export const cusOrderList = data => fetch('/Cus_Order/List_Cus_Order', data, 'POST');
export const getWxQRCode = data => fetch('/Cus_Order/Get_Wx_QRCode', data, 'POST');
export const getAliQRCode = data => fetch('/Cus_Order/Get_Alipay_QRCode', data, 'POST');
export const getCusRestCash = data => fetch('/Cus_Order/Get_Customer_RestCash', data, 'POST');
export const payOrderbyRestCash = data => fetch('/Cus_Order/Pay_OrderBy_RestCash', data, 'POST');
export const addCusOrder = data => fetch('/Cus_Order/Add_Cus_Order', data, 'POST');
export const editCusOrder = data => fetch('/Cus_Order/Edit_Cus_Order', data, 'POST');
export const cancelCusOrder = data => fetch('/Cus_Order/Cancel_Cus_Order', data, 'POST');
export const delCusOrder = data => fetch('/Cus_Order/Delete_Cus_Order', data, 'POST');
export const examineCusOrder = data => fetch('/Cus_Order/Examine_Cus_Order', data, 'POST');
export const remitCusOrder = data => fetch('/Cus_Order/Remit_Cus_Order', data, 'POST');
// 获取流量池
export const getPoolList = data => fetch('/Cus_FlowPool/Get_FlowPoolList', data, 'POST');
// 获取sim卡组用于审核
export const getSimGoupCombo = data => fetch('/Sim_Group/List_Sim_Group_Combo', data, 'POST');
// 获取一个sim卡组的sim卡数量
export const groupSimCount = data => fetch('/Sim_Group/Group_SimCount', data, 'POST');
//   endregion
//  region SIM卡资费配置
/**
/**
 * 获取SIM卡资费配置
 */
export const simExpanseConfigPagedList = data => fetch('/Sim_FreeExpenseConfig/List_Sim_FreeExpenseConfig', data, 'POST');
//新版资费
export const Res_ExpensesPagedList = data => fetch('/Res_Expenses/List_Res_Expenses', data, 'POST');
export const addRes_Expenses = data => fetch('/Res_Expenses/Add_Res_Expenses', data, 'POST');
export const delRes_Expenses = data => fetch('/Res_Expenses/Delete_Res_Expenses', data, 'POST');
export const editRes_Expenses = data => fetch('/Res_Expenses/Edit_Res_Expenses', data, 'POST');


/**
 * 添加SIM卡资费配置
 */
export const addSimExpanseConfig = data => fetch('/Sim_FreeExpenseConfig/Add_Sim_FreeExpenseConfig', data, 'POST');
/**
 * 修改SIM卡资费配置
 */
export const editSimExpanseConfig = data => fetch('/Sim_FreeExpenseConfig/Edit_Sim_FreeExpenseConfig', data, 'POST');
/**
 * 删除SIM卡资费配置
 */
export const delSimExpanseConfig = data => fetch('/Sim_FreeExpenseConfig/Delete_Sim_FreeExpenseConfig', data, 'POST');
//   endregion

/**
 * 获取商品发布list
 */
export const goodsPagedList = data => fetch('/BackCashGoods/List_BackCashGoods', data, 'POST');
/**
 * 添加商品
 */
export const addGoods = data => fetch('/BackCashGoods/Add_BackCashGoods', data, 'POST');
/**
 * 修改商品
 */
export const editGoods = data => fetch('/BackCashGoods/Edit_BackCashGoods', data, 'POST');
/**
 * 删除商品
 */
export const delGoods = data => fetch('/BackCashGoods/Delete_BackCashGoods', data, 'POST');
/**
 * 发布商品
 */
export const releaseGoods = data => fetch('/BackCashGoods/Release_BackCashGoods', data, 'POST');
/**
 * 获取活动list
 */
export const newsPagedList = data => fetch('/News/List_News', data, 'POST');
/**
 * 添加活动
 */
export const addNews = data => fetch('/News/Add_News', data, 'POST');
/**
 * 修改活动
 */
export const editNews = data => fetch('/News/Edit_News', data, 'POST');
/**
 * 删除活动
 */
export const delNews = data => fetch('/News/Delete_News', data, 'POST');
/**
 * 发布活动
 */
export const releaseNews = data => fetch('/News/Release_News', data, 'POST');
/**
 * 获取app首页轮播图list
 */
export const appHomeImgList = data => fetch('/App_HomeImage/List_App_HomeImage', data, 'POST');
/**
 * 添加轮播图
 */
export const addAppHomeImg = data => fetch('/App_HomeImage/Add_App_HomeImage', data, 'POST');
/**
 * 修改轮播图
 */
export const editAppHomeImg = data => fetch('/App_HomeImage/Edit_App_HomeImage', data, 'POST');
/**
 * 删除轮播图
 */
export const delAppHomeImg = data => fetch('/App_HomeImage/Delete_App_HomeImage', data, 'POST');
/**
 * 获取app用户分页list
 */
export const appUserPagedList = data => fetch('/App_User/List_App_User', data, 'POST');
/**
 * 获取app用户分页list
 */
export const appUserAccountPagedList = data => fetch('/App_User/List_App_User_AccountDetail', data, 'POST');
/**
 * 获取订单分页list
 */
export const orderPagedList = data => fetch('/BackCashOrder/List_BackCashOrder', data, 'POST');
/**
 * 报名
 */
export const enrollDrivingSchool = data => fetch('/BackCashOrder/EnrollDrivingSchool', data, 'POST');
/**
 * 获取运营商列表
 */
export const ResOperatorList = data => fetch('/Res_Operator/List_Res_Operator', data, 'POST');
/**
 * 删除运营商
 */
export const delResOperator = data => fetch('/Res_Operator/Delete_Res_Operator', data, 'POST');
/**
 * 添加运营商
 */
export const addResOperator = data => fetch('/Res_Operator/Add_Res_Operator', data, 'POST');
/**
 * 修改运营商
 */
export const editResOperator = data => fetch('/Res_Operator/Edit_Res_Operator', data, 'POST');
/**
 * 获取充值列表
 */
export const Cus_AccountDetailList = data => fetch('/Cus_AccountDetail/List_Cus_AccountDetail', data, 'POST');
/**
 * 删除充值列表
 */
export const delCus_AccountDetail = data => fetch('/Cus_AccountDetail/Delete_Cus_AccountDetail', data, 'POST');
/**
 * 获取充值
 */
export const GetCusAccountDetail = data => fetch('/Cus_AccountDetail/Get_Cus_AccountDetail', data, 'POST');
/**
 * 修改充值
 */
export const editCusAccountDetail = data => fetch('/Cus_AccountDetail/Get_Cus_AccountDetail', data, 'POST');
/**
 * 获取充值订单列表
 */
export const Cus_DepositOrderList = data => fetch('/Cus_DepositOrder/List_Cus_DepositOrder', data, 'POST');
/**
 * 添加充值订单
 */
export const addCusDepositOrder = data => fetch('/Cus_DepositOrder/List_Cus_DepositOrder', data, 'POST');

