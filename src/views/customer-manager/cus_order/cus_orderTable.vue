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
          <Button @click="searchEnter"   class="top-btn" size="large" icon="search" >搜索</Button>
        </Col>
        <transition name="fade">
          <Card v-show="searchPaneShow" style="position:absolute;top:1px;z-index:100;" :style="{right:IsAdmin?'85px':'185px'}" :padding=12>
            <p style="text-align:center;margin-bottom:10px;"><Icon type="search"></Icon>搜索</p>
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:400px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="用户名称"  >
                  <Input v-model="searchForm.cus_Name" ></Input>
                </Form-item>
              </Row>
              <Row>
                <Form-item label="订单状态"  >
                  <Select v-model="searchForm.status" >
                    <Option v-for="item in statusList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                  </Select>
                </Form-item>
              </Row>
            </Form>
            <Row >
              <Button  style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff" size="small"   @click="doSearchTableList">确定</Button>
              <Button  style="float:right;margin-top:10px;" size="small" @click="resetSearch" >重置</Button>
            </Row>
          </Card>
        </transition>
      </Row>
    </div>
    <!--table-->
    <Row>
      <Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <!--新增编辑-->
    <cus_orderForm   :modalShow="formShow"
                     :modalFormTitle="formTitle"
                     :parentForm="parentForm"
                     @listenModalForm="hideModel"
                     @refreshTableList="getTableList" ></cus_orderForm>
    <!--审核订单-->
    <examine_cus_order   :modalShow="examineShow"
                         :parentForm="parentForm"
                         @listenModalExamine="hideExamine"
                         @refreshTableList="getTableList"></examine_cus_order>
    <!--是否删除框-->
    <Modal v-model="delModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="btnLoading"  @click="comfirmDel">删除</Button>
      </div>
    </Modal>
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
  </div>

</template>

<script>
  import Cookies from 'js-cookie'
  import {cusOrderList,delCusOrder,cancelCusOrder} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import cus_orderForm from './cus_orderForm.vue'
  import examine_cus_order from './examine_cus_order.vue'
  import order_expandTable from './order_expandTable.vue';
  export default {
    name:'basic_Info',
    components:{
      cus_orderForm,
      order_expandTable,
      examine_cus_order
    },
    data() {
      return {
        searchPaneShow:false,
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
            align:'center',
            title: '客户名称',
            key: 'Cus_Name',
          },
          {
            align:'center',
            title: '订单号',
            key: 'OrderNum',
          },
           {
            align:'center',
            title: '运营商',
            key: 'OperTypeText',
          },
          {
            align:'center',
            title: '资费类型',
            key: 'Res_ExpensesName',
          },
           {
            align:'center',
            title: '购买种类',
            key: 'SingleOrPoolText',
          },
          {
            align:'center',
            title: 'SIM卡类型',
            key: 'Sim_TypeText',
          },
          {
            align:'center',
            title: 'SIM卡数量(个)',
            key: 'Sim_Count',
          },
          {
            align:'center',
            title: '流量',
            key: 'FlowCount',render: (h, params) => {
               if(params.row.FlowCount/1024<1024)
                 return params.row.FlowCount/1024+'MB';
               else
                return params.row.FlowCount/(1024*1024)+'GB';
               },
          },
          {
            align:'center',
            title: '购买单价（元）',
            key: 'SinglePrice',render: (h, params) => {  return '￥'+ params.row.SinglePrice.toFixed(2);},
          },
          {
            align:'center',
            title: '下单时间',
            key: 'OrderTime',
          },
          {
            align:'center',
            title: '订单金额(元)',
            key: 'OrderPrice',render: (h, params) => { return params.row.OrderPrice.toFixed(2);},
          },
          {
            align:'center',
            title: '订单状态',
            key: 'OrderStatusTxt',
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let actions=[];
              if (params.row.OrderStatus===1&&!this.IsAdmin){ //待付款状态
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
                      this.payOrder(params.row)
                    }
                  }
                }, '支付'));

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
                      this.examineOrder(params.row)
                    }
                  }
                }, '审核'));
              }

              if (params.row.OrderStatus===0&&!this.IsAdmin){ //已取消状态
                actions.push(  h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delOrder(params.row.Id)
                    }
                  }
                }, '删除'));
              }
              return h('div', actions);
            }
          }
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        formShow:false,
        formTitle:'添加订单',
        resetForm:{
          Id:'',
          Sim_Count: 20,
          FlowCount: 10,
          SinglePrice: 0,
          ChargePrice: 0,
          OrderPrice:0,
          ReceiveName:'',
          ReceiveMobile:'',
          ReceiveAddress:'',
          OrderStatus:'',
          OrderNum:'',
          RemittanceUrl:'',
          RemittancePhone:'',
          Sim_Type:1,
          ValidMonth:1,
          UseCase:'',
          SimGroupId:'',
        },
        parentForm:{
          Id:'',
          Sim_Count: 20,
          SingleOrPoolText:'',
          Res_ExpensesName:'',
          FlowCount: 10,
          SinglePrice: 0,
          ChargePrice: 0,
          OrderPrice:0,
          ReceiveName:'',
          ReceiveMobile:'',
          ReceiveAddress:'',
          OrderStatus:'',
          OrderNum:'',
          RemittanceUrl:'',
          RemittancePhone:'',
          Sim_Type:1,
          ValidMonth:1,
          UseCase:'',
          SimGroupId:'',
        },
        delModal:false,
        delId:'', //删除的Id
        cancelModal:false,
        cancelId:'',//取消Id
        examineShow:false,//审核窗口
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
            label: '已完成'
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
      searchEnter(){
         this.searchPaneShow=!this.searchPaneShow;
      },
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
        const res = await cusOrderList(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
     
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      addOrder() {
        this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
        this.formTitle='添加订单';
        this.formShow=true;
      },
      payOrder(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.parentForm.FlowCount=this.parentForm.FlowCount/(1024*1024)
        this.formTitle='支付订单';
        this.formShow=true;
      },
      cancelOrder(Id){
        this.cancelId=Id;
        this.cancelModal=true;
      },
      async examineOrder(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.examineShow=true;
      },
      delOrder(Id){
        this.delId=Id;
        this.delModal=true;
      },
      async comfirmCancel(){
        this.btnLoading=true;
        try{
          const res= await cancelCusOrder({Id:this.cancelId});
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
      async comfirmDel(){
        this.btnLoading=true;
        try{
          const res= await delCusOrder({Id:this.delId});
          if (res.success) {
            this.$Message.success('删除成功!');
            this.getTableList();
            this.delModal=false;
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
