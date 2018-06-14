<style>
  
  .chargeHisTable {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="chargeHisTable">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
          <Button @click="searchEnter"   class="top-btn" size="large" icon="search" >搜索</Button>
        </Col>
        <transition name="fade">
          <Card v-show="searchPaneShow" style="position:absolute;top:1px;right:83px;z-index:100;" :padding=12>
            <p style="text-align:center;margin-bottom:10px;"><Icon type="search"></Icon>搜索</p>
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:400px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="流量池编号"  >
                  <Input v-model="searchForm.poolNum" ></Input>
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
    <chargeHisForm    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></chargeHisForm>
    <!--是否删除框-->
    <Modal v-model="cancelModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>取消确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续取消订单？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="btnLoading" @click="comfirmCancel">取消</Button>
      </div>
    </Modal>
    <Modal v-model="delModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续删除订单？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="btnLoading"  @click="comfirmDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="comfirmModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>续费确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认续费此订单？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="btnLoading"  @click="comfirmFinish">确认</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import Cookies from 'js-cookie'
  import {reChargeHistory,cancelChargeOrder,delChargeOrder,comfirmChargeOrder} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import chargeHisForm from './chargeHisForm.vue';
  import expandRow from './chargeHis_expandTable.vue';
  export default {
    name:'chargeHisTable',
    components:{
      chargeHisForm,
      expandRow
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
              return h(expandRow, {
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
            title: '订单编号',
            key: 'ReChargeOrderNum',
          },
          {
            align:'center',
            title: '流量池编号',
            key: 'PoolNum'
          },
          {
            align:'center',
            title: '充值流量（GB）',
            key: 'ChargeFlowCount',
          },
          {
            align:'center',
            title: '消费金额（元）',
            key: 'ChargeFee', render: (h, params) => { return params.row.ChargeFee.toFixed(2);},
          },
          {
            align:'center',
            title: '订单状态',
            key: 'ChargeStatusTxt',
          },
          {
            align:'center',
            title: '下单时间',
            key: 'ChargeTime',
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let actions=[];
              if (params.row.ChargeStatus===1&&!this.IsAdmin){ //待付款状态
                console.log(params.row.ChargeStatus)
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
                      this.payHisOrder(params.row)
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
                      this.cancelOrder(params.row)
                    }
                  }
                }, '取消'));
              }

              if (params.row.ChargeStatus===0&&!this.IsAdmin) { //已取消状态
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

              if (params.row.ChargeStatus===2&&this.IsAdmin) { //已付款状态
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
                      this.comfirmOrder(params.row)
                    }
                  }
                }, '确认续费'));
              }
              
              return h('div', actions);
            }
          }
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        delModal:false,
        cancelModal:false,
        delId:'', //删除的Id
        cancelOrderNum:'',
        comfirmModal:false,
        comfirmReChargeOrder:'',//需要确认完成的续费订单
        btnLoading:false,
        searchForm:{
          poolNum: '',
          status:'-1',
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
          },
        ],
        parentForm:{
          Id:'',
          ReChargeOrderNum: '',
          ChargeFee:0,
          ChargeFlowCount: 0,
          ChargeStatus: 0,
        },
        formTitle:'支付订单',
        formShow:false,
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
    methods: {
      searchEnter(){
         this.searchPaneShow=!this.searchPaneShow;
      },
      resetSearch(){
        this.searchForm.poolNum='';
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
        const res = await reChargeHistory(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
        console.log(this.tableData);
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      cancelOrder(p){
        this.cancelModal=true;
        this.cancelOrderNum=p.ReChargeOrderNum;
      },
      payHisOrder(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='支付订单';
        this.formShow=true;
      },
      async comfirmCancel(){
        this.btnLoading=true;
        const res = await cancelChargeOrder({orderNum: this.cancelOrderNum});
        if (res.success) {
          this.$Message.success('订单取消成功!');
          this.cancelModal=false;
          this.getTableList();
        }else{
          this.$Message.error(res.msg);
        }
        this.btnLoading=false;
      },
      delOrder(Id){
        this.delId=Id;
        this.delModal=true;
      },
      async comfirmDel(){
        this.btnLoading=true;
        try{
          const res= await delChargeOrder({Id:this.delId});
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
      comfirmOrder(row){
        this.comfirmReChargeOrder=row;
        this.comfirmModal=true;
      },
      async comfirmFinish(){
        this.btnLoading=true;
        try{
          const res= await comfirmChargeOrder(this.comfirmReChargeOrder);
          if (res.success) {
            this.$Message.success('成功!');
            this.getTableList();
            this.comfirmModal=false;
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
    }
  }
  
  

</script>
