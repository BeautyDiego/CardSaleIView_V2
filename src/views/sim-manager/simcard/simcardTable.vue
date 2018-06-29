<style>
  
  .simcardTable {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="simcardTable">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
          <!--<Button class="top-right-btn" size="large" icon="plus" @click="addUser">添加</Button>-->
          <Button @click="searchEnter"   class="top-btn" size="large" icon="search" >搜索</Button>
        </Col>
        <transition name="fade">
          <Card v-show="searchPaneShow" style="position:absolute;top:1px;right:85px;z-index:100;" :padding=12>
            <p style="text-align:center;margin-bottom:10px;"><Icon type="search"></Icon>搜索</p>
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:400px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="SIM卡号"  >
                  <Input v-model="searchForm.SimNum" ></Input>
                </Form-item>
              </Row>
              <Row>
                <Form-item label="流量池编号"  >
                  <Input v-model="searchForm.PoolNum" ></Input>
                </Form-item>
              </Row>
              <Row>
                <Form-item label="卡状态"  >
                  <Select v-model="searchForm.SimStatus" >
                    <Option value="全部">全部</Option>
                    <Option value="在用">在用</Option>
                    <Option value="活卡待激活">活卡待激活</Option>
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
    <!--&lt;!&ndash;新增编辑&ndash;&gt;-->
    <simcardForm    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></simcardForm>
    <!--&lt;!&ndash;新增编辑备注&ndash;&gt;-->
    <simcardRemark    :modalShow="remarkformShow"
                    modalFormTitle="编辑备注"
                    :parentForm="parentForm"
                    @listenModalForm="hideRemarkModel"
                    @refreshTableList="getTableList" ></simcardRemark>
  </div>

</template>

<script>
  import {simcardListPage} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import simcardForm from './simcardForm.vue'
  import simcardRemark from './simcardRemark.vue'
  export default {
    name:'simcardTable',
    components:{
      simcardForm,
      simcardRemark
    },
    data() {
      return {
        searchPaneShow:false,
        tableLoading:false,//table是否在加载中
        tableColums: [
          {
            align:'center',
            title: '组名',
            key: 'GroupName',
          },
          {
            align:'center',
            title: '流量池编号',
            key: 'PoolNum',
          },
          {
            align:'center',
            title: 'SIM卡号',
            key: 'SimNum',
          },
          {
            align:'center',
            title: '卡状态',
            key: 'SimStatus',
          },
          {
            align:'center',
            title: 'IMSI',
            key: 'IMSI'
          },
          {
            align:'center',
            title: 'ICCUID',
            key: 'ICCUID',
          },
          {
            align:'center',
            title: '生效时间',
            key: 'ValidDate',
          },
          {
            align:'center',
            title: '过期时间',
            key: 'ExpValidDate',
          },
          {
            align:'center',
            title: '备注',
            key: 'Remark',
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let actions=[];
              if (params.row.SimStatus==='在用'){
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
                      this.checkSIM(params.row)
                    }
                  }
                }, '查看详情'));
              }

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
                    this.addRemark(params.row)
                  }
                }
              }, '编辑备注'));
              
              return h('div', actions);
            }
          }
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        formShow:false,
        formTitle:'添加用户',
        parentForm:{
          Id:'',
          Cus_Name: '',
          LoginName: '',
          Cus_Address: '',
          Industry: '',
          Region: '',
          ManagerName: '',
          ManagerEmail: '',
          ManagerMobile:'',
          Remark:'',
          Admin_GroupId:'',
          Agent_GroupId:'',
          Customer_GroupId:'',
        },
        searchForm:{
          SimStatus:'全部',
          PoolNum: '',
          SimNum: '',
          rows:10,
          page:1,
        },
        remarkformShow:false,//修改备注窗体
      }
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
        this.searchForm.PoolNum='';
        this.searchForm.SimNum='';
        this.searchForm.SimStatus='全部';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await simcardListPage(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      checkSIM(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='查看详情';
        this.formShow=true;
      },
      addRemark(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.remarkformShow=true;
      },
      hideModel(){
        this.formShow=false;
      },
      hideRemarkModel(){
        this.remarkformShow=false;
      }
    }
  }

</script>
