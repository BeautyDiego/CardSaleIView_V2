<style>
  
  .simGroupTable {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="simGroupTable">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
        <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
          <Button type="primary" class="top-btn" size="large"  icon="ios-search">搜  索</Button>
          <div style="text-align:center" slot="content">
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:300px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="SIM卡组名"  >
                  <Input v-model="searchForm.GroupName" ></Input>
                </Form-item>
              </Row>
            </Form>
            <Row >
              <Button  style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff" size="small"   @click="doSearchTableList">确定</Button>
              <Button  style="float:right;margin-top:10px;" size="small" @click="resetSearch" >重置</Button>
            </Row>
          </div>
        </Poptip>
          <Button class="top-right-btn" size="large" icon="plus" @click="addSIMGroup" >添加</Button>
        </Col>
      </Row>
    </div>
    <!--table-->
    <Row>
      <Table stripe size="small"   :loading="tableLoading" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <!--&lt;!&ndash;新增编辑&ndash;&gt;-->
    <simGroupForm   :modalShow="formShow"
                    :modalFormTitle="formTitle"
                    :parentForm="parentForm"
                    @listenModalForm="hideModel"
                    @refreshTableList="getTableList" ></simGroupForm>
    <!--&lt;!&ndash;新增编辑&ndash;&gt;-->
    <simGroupTransfer   :modalShow="transferFormShow"
                        :parentForm="parentForm"
                        @listenModalForm="hideTransferModel"
                        @refreshTableList="getTableList" ></simGroupTransfer>
    <!--&lt;!&ndash;组员信息查看，针对管理员&ndash;&gt;-->
    <simGroupDetail   :modalShow="detailFormShow"
                      :parentForm="parentForm"
                      @listenModalForm="hideDetailModel"
                      @refreshTableList="getTableList" ></simGroupDetail>
    <!--&lt;!&ndash;组员信息查看，针对管理员&ndash;&gt;-->
    <groupBindPool   :modalShow="bindPoolShow"
                     :parentForm="parentForm"
                     @listenModalForm="hideBindPoolModel"
                     @refreshTableList="getTableList" ></groupBindPool>
    <!--&lt;!&ndash;组员信息查看，针对管理员&ndash;&gt;-->
    <groupToCustomer   :modalShow="groupToCustomerShow"
                     :parentForm="parentForm"
                     @listenModalForm="hideGroupToCustomerModel"
                     @refreshTableList="getTableList" ></groupToCustomer>
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
  </div>

</template>

<script>
  import Cookies from 'js-cookie'
  import { mapState } from 'vuex'
  import simGroupForm from './simGroupForm.vue'
  import simGroupTransfer from './simGroupTransfer.vue'
  import simGroupDetail from './simGroupDetail.vue'
  import groupBindPool from './groupBindPool.vue'
  import groupToCustomer from './groupToCustomer.vue'
  import {simGroupListPage,delSimGroup} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  export default {
    name:'simGroupTable',
    components:{
      simGroupForm,
      simGroupTransfer,
      simGroupDetail,
      groupBindPool,
      groupToCustomer
    },
    data() {
      return {
        tableLoading:false,//table是否在加载中
        tableColums: [
          {
              type: 'index',
              width: 60,
              title: '序号',
              align: 'center'
          },
          {
            align:'center',
            title: 'SIM卡组名',
            key: 'GroupName',
          },
          {
            align:'center',
            title: '组描述',
            key: 'GroupDescribe',
          },
          {
            align:'center',
            title: '备注',
            key: 'Remark',
          },
          {
            align:'center',
            title: '创建人',
            key: 'UserName',
          },
          {
            title: '操作',
            align: 'center',
            width:500,
            fixed:'right',
            render: (h, params) => {
              let actions=[];
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
                    this.editSIMGroup(params.row)
                  }
                }
              }, '修改'));

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
                    this.delSIMGroup(params.row.Id)
                  }
                }
              }, '删除'));
              if (!params.row.IsBind){

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
                        this.Grouping(params.row)
                      }
                    }
                  }, '添加组员'));


                if (this.IsAdmin){
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
                                this.bindPool(params.row)
                            }
                        }
                    }, '绑定流量池'));
                }

                if (this.IsAgent){
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
                                this.groupToCustomer(params.row)
                            }
                        }
                    }, '发卡'));
                }
               

              }
              
                actions.push( h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.checkGroup(params.row)
                    }
                  }
                }, '查看组员'));
              
             
              
              return h('div', actions);
            }
          }
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        formShow:false,
        formTitle:'添加SIM卡组',
        parentForm:{
          Id:'',
          GroupName: '',
          GroupDescribe: '',
          Remark:'',
          OwerType:'',
          IsBind:false,
          PoolNum:''
        },
        searchForm:{
          GroupName: '',
          rows:10,
          page:1,
        },
        transferFormShow:false,
        delModal:false,
        delId:'', //删除的Id
        detailFormShow:false,
        bindPoolShow:false,
        groupToCustomerShow:false,
      }
    },
    computed: {
      IsAdmin: function () {
        return  Cookies.get('roleName')==='管理员';
      },
      ...mapState({
        adminInfo: state => state.user.adminInfo,
      }),
      IsCustomer:function () {
        return this.adminInfo.OwerType==3;
      },
      IsAgent:function () {
        return this.adminInfo.OwerType==2;
      }
    },
    created(){

    },
    mounted(){
      this.getTableList();
    },
    methods: {
      resetSearch(){
        this.searchForm.GroupName='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await simGroupListPage(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      addSIMGroup(){
        clearObj(this.parentForm);
        this.parentForm.IsBind=false;
        this.formTitle='添加SIM卡组';
        this.formShow=true;
      },
      editSIMGroup(row){
        this.parentForm=JSON.parse(JSON.stringify(row))
        this.formTitle='修改SIM卡组';
        this.formShow=true;
      },
      Grouping(row){
        this.parentForm=JSON.parse(JSON.stringify(row))
        this.transferFormShow=true;
      },
      checkGroup(row){
        this.parentForm=JSON.parse(JSON.stringify(row))
        this.detailFormShow=true;
      },
      bindPool(row){
        this.parentForm=JSON.parse(JSON.stringify(row))
        this.bindPoolShow=true;
      },
      groupToCustomer(row){
          this.parentForm=JSON.parse(JSON.stringify(row))
          this.groupToCustomerShow=true;
      },
      delSIMGroup(Id){
        this.delId=Id;
        this.delModal=true;
      },
      async comfirmDel(){
        this.btnLoading=true;
        try{
          const res= await delSimGroup({Id:this.delId});
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
      hideTransferModel(){
        this.transferFormShow=false;
      },
      hideDetailModel(){
        this.detailFormShow=false;
      },
      hideBindPoolModel(){
        this.bindPoolShow=false;
      },
      hideGroupToCustomerModel(){
        this.groupToCustomerShow = false;
      },
    }
  }

</script>
