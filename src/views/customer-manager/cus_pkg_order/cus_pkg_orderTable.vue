<style>
  
  .cus_order {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="cus_order">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
          <!--<Button class="top-right-btn" size="large" icon="plus" @click="addOrder" v-if="!IsAdmin">添加</Button>-->
        <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn" >
          <Button type="primary" size="large" icon="ios-search">搜  索</Button>
          <div style="text-align:center" slot="content">
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="width:350px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="用户名称"  >
                  <Input v-model="searchForm.cus_Name" ></Input>
                </Form-item>
              </Row>
              <Row>
                <Form-item label="订单状态"  >
                  <Select v-model="searchForm.status" :transfer="true">
                    <Option v-for="item in statusList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                  </Select>
                </Form-item>
              </Row>
            </Form>
            <Row >
              <Button  style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff" size="small"   @click="doSearchTableList">确定</Button>
              <Button  style="float:right;margin-top:10px;" size="small" @click="resetSearch" >重置</Button>
            </Row>
          </div>
        </Poptip>
        </Col>
      </Row>
    </div>
    <!--table-->
    <Row>
      <Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <!--是否删除框-->
    <!--<Modal v-model="delModal" width="360">-->
      <!--<p slot="header" style="color:#f60;text-align:center">-->
        <!--<Icon type="information-circled"></Icon>-->
        <!--<span>删除确认</span>-->
      <!--</p>-->
      <!--<div style="text-align:center">-->
        <!--<p>是否继续删除？</p>-->
      <!--</div>-->
      <!--<div slot="footer">-->
        <!--<Button type="error" size="large" long :loading="btnLoading"  @click="comfirmDel">删除</Button>-->
      <!--</div>-->
    <!--</Modal>-->
    <!--是否取消订单-->
    <Modal v-model="cancelModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>取消确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续取消订单？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="btnLoading"  @click="comfirmCancel">确认取消订单</Button>
      </div>
    </Modal>
    <!--是否删除框-->
    <Modal v-model="examineModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>审核确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续审核通过订单？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="btnLoading"  @click="comfirmExamine">审核通过</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import Cookies from 'js-cookie'
  import {getPkgOrderList,cancelPkgOrder,examinePkgOrder} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  export default {
    name:'cus_pkg_order',
    components:{

    },
    data() {
      return {
        tableLoading:false,
        tableColums: [
              {
                  type: 'expand',
                  width: 50,
                  render: (h, params) => {
                      return h(order_expandTable, {
                          props: {
                              row: params.row
                          }
                      })
                  }
              },
              {
                  type: 'index',
                  width: 60,
                  title: '序号',
                  align: 'center'
              },
              {
                  align:'center',
                  title: '客户名称',
                  key: 'Cus_Name',
              },
              {
                  align:'center',
                  title: '订单号',
                  key: 'PkgOrderNum',
              },
              {
                  align:'center',
                  title: '运营商',
                  key: 'OperType',
                  render: (h, params) => {
                      let operName='';
                      if (params.row.OperType==1){
                          operName='中国电信'
                      }else if(params.row.OperType==2){
                          operName='中国移动'
                      }else if(params.row.OperType==3){
                          operName='中国联通'
                      }
                      return operName;
                  },
              },
              {
                  align:'center',
                  title: 'sim卡数量',
                  key: 'SimCount',
              },
              {
                  align:'center',
                  title: '原套餐名',
                  key: 'OldPkgName',
              },
              {
                  align:'center',
                  title: '新套餐名',
                  key: 'NewPkgName',
              },
              {
                  align:'center',
                  title: 'SIM卡数量(个)',
                  key: 'Sim_Count',
              },
              {
                  align:'center',
                  title: '购买单价（元）',
                  key: 'SinglePrice',render: (h, params) => {  return '￥'+ params.row.SinglePrice.toFixed(2);},
              },
              {
                  align:'center',
                  title: '下单时间',
                  key: 'JoinDate',
              },
              {
                  align:'center',
                  title: '订单金额(元)',
                  key: 'TotalPrice',render: (h, params) => { return '￥'+ params.row.TotalPrice.toFixed(2);},
              },
              {
                  align:'center',
                  title: '订单状态',
                  key: 'OrderStatus',
                  render: (h, params) => {
                      let statusTxt='';
                      if (params.row.OrderStatus==0){
                          statusTxt='已取消'
                      }else if(params.row.OrderStatus==1){
                          statusTxt='待付款'
                      }else if(params.row.OrderStatus==2){
                          statusTxt='已付款'
                      }else if(params.row.OrderStatus==3){
                          statusTxt='已审核'
                      }else if(params.row.OrderStatus==4){
                          statusTxt='已发货'
                      }else if(params.row.OrderStatus==5){
                          statusTxt='已完成'
                      }
                      return statusTxt;
                  },
              },
              {
                  align:'center',
                  title: '运营商单号',
                  key: 'ResultOrderNum',
              },
              {
                  title: '操作',
                  align: 'center',
                  render: (h, params) => {
                      let actions=[];
                      if (params.row.OrderStatus===1&&!this.IsAdmin){ //待付款状态

                          actions.push( h('Button', {
                              props: {
                                  type: 'warning',
                                  size: 'small'
                              },
                              style: {
                                  marginRight: '5px'
                              },
                              on: {
                                  click: () => {
                                      this.cancelOrder(params.row.Id)
                                  }
                              }
                          }, '取消'));
                      }

                      if (this.IsAdmin&&params.row.OrderStatus===2){ //已付款状态
                          actions.push( h('Button', {
                              props: {
                                  type: 'primary',
                                  size: 'small'
                              },
                              style: {
                                  marginRight: '5px'
                              },
                              on: {
                                  click: () => {
                                      this.examineOrder(params.row.Id)
                                  }
                              }
                          }, '审核'));
                      }

                      return h('div', actions);
                  }
              }
          ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        parentForm:{

        },
        cancelModal:false,
        cancelId:'',//取消Id
        examineModal:false,
        examineId:'', //审核Id
        btnLoading:false,
        searchForm:{
          status:'-1',
          cus_Name: '',
          rows:10,
          page:1,
        },
        statusList: [
          {
            value: '-1',
            label: '全部'
          },
          {
            value: '1',
            label: '待付款'
          },
          {
            value: '2',
            label: '已付款'
          },
          {
            value: '3',
            label: '已审核'
          },
          {
            value: '0',
            label: '已取消'
          }],
      }
    },
    computed: {
      IsAdmin: function () {
        return  Cookies.get('roleName')==='管理员';
      },
    },
    created(){

    },
    mounted(){
      
      this.getTableList();
    },
    activated(){
    
    },
    methods: {
      resetSearch(){
         this.searchForm.cus_Name='';
         this.searchForm.status='-1';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await getPkgOrderList(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
     
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      cancelOrder(Id){
        this.cancelId=Id;
        this.cancelModal=true;
      },
      examineOrder(Id){
        this.examineId=Id;
        this.examineModal=true;
      },
      async comfirmCancel(){
          this.btnLoading=true;
          try{
              const res= await cancelPkgOrder({Id:this.cancelId});
              if (res.success) {
                  this.$Message.success('取消订单成功!');
                  this.getTableList();
                  this.cancelModal=false;
              }else{
                  this.$Message.error(res.msg);
              }
          }catch(err){
              console.log(err);
              this.$Message.error('服务器异常，稍后再试');
          }
          this.btnLoading=false;
      },
      async comfirmExamine(){
        this.btnLoading=true;
        try{
          const res= await examinePkgOrder({Id:this.examineId});
          if (res.success) {
            this.$Message.success('审核通过!');
            this.getTableList();
            this.examineModal=false;
          }else{
            this.$Message.error(res.msg);
          }
        }catch(err){
          console.log(err);
          this.$Message.error('服务器异常，稍后再试');
        }
        this.btnLoading=false;
      },
      hideModel(){
        this.formShow=false;
      },
      hideExamine(){
        this.examineShow=false;
      },
    }
  }

</script>
