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
    <TransationForm  :modalShow="formShow"
                     :transationId="transationId"
                     @listenModalForm="hideModel"></TransationForm>
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
  import {getSimStatusOrderList} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import TransationForm from './TransationForm.vue'
  export default {
    name:'cus_pkg_order',
    components:{
        TransationForm
    },
    data() {
      return {
        tableLoading:false,
        tableColums: [
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
                  key: 'OrderNum',
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
                  title: '变更状态',
                  key: 'TargetStatus',
              },
              {
                  align:'center',
                  title: '申请时间',
                  key: 'ApplyTime',
              },
              {
                  align:'center',
                  title: '变更流水Id',
                  key: 'TransationId',
                  render: (h, params) => {
                      let actions=[];

                      actions.push( h('a', {

                          style: {
                              marginRight: '5px'
                          },
                          on: {
                              click: () => {
                                  this.checkTransation(params.row.TransationId)
                              }
                          }
                      }, params.row.TransationId));

                      return h('div', actions);
                  }
              },
              {
                  align:'center',
                  title: '返回码',
                  key: 'ResultCode',
              },
              {
                  align:'center',
                  title: '返回结果',
                  key: 'ResultMsg',
              }
          ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        transationId:'',
        formShow:false,
        btnLoading:false,
        searchForm:{
          cus_Name: '',
          rows:10,
          page:1,
        },
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
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await getSimStatusOrderList(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
     
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      checkTransation(transationId){
          this.transationId=transationId;
          this.formShow=true;
      },
//      async comfirmCancel(){
//          this.btnLoading=true;
//          try{
//              const res= await cancelPkgOrder({Id:this.cancelId});
//              if (res.success) {
//                  this.$Message.success('取消订单成功!');
//                  this.getTableList();
//                  this.cancelModal=false;
//              }else{
//                  this.$Message.error(res.msg);
//              }
//          }catch(err){
//              console.log(err);
//              this.$Message.error('服务器异常，稍后再试');
//          }
//          this.btnLoading=false;
//      },
      hideModel(){
        this.formShow=false;
      },
    }
  }

</script>
