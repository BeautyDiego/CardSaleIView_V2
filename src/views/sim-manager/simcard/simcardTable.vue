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
            <RadioGroup v-model="searchForm.CardTypeText" type="button" size="large"  @on-change='doChangeCardType' >
              <Radio label="单卡"></Radio>
              <Radio label="流量池成员"></Radio>
            </RadioGroup>
          <!--<Button class="top-right-btn" size="large" icon="plus" @click="addUser">添加</Button>-->
        <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
          <Button type="primary" class="top-btn" size="large"  icon="ios-search">搜  索</Button>
          <div style="text-align:center" slot="content">
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:300px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
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
                  <Input v-model="searchForm.SimStatus" ></Input>
                </Form-item>
              </Row>
            </Form>
            <Row >
              <Button  style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff" size="small"   @click="doSearchTableList">确定</Button>
              <Button  style="float:right;margin-top:10px;" size="small" @click="resetSearch" >重置</Button>
            </Row>
          </div>
        </Poptip>
        <Button @click="importSimCard" type="warning"   class="top-btn" size="large" icon="ios-cloud-upload-outline" >导入SIM卡</Button>

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
    <simAddFlow    :modalShow="addFlowformShow"
                    modalFormTitle="流量加油包"
                    :parentForm="parentForm"
                    @listenModalForm="hideRemarkModel"
                    @refreshTableList="getTableList" ></simAddFlow>
    <!--&lt;!&ndash;新增编辑备注&ndash;&gt;-->
  <simcardImport    :modalShow="importFormShow"
                   @listenModalForm="hideImportModel"
                   @refreshTableList="getTableList" ></simcardImport>
  </div>

</template>

<script>
  import {simcardListPage} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import simcardForm from './simcardForm.vue'
  import simcardRemark from './simcardRemark.vue'
  import simAddFlow from './simAddFlow.vue'
  import simcardImport from './simcardImport.vue'
  import {baseUrl} from './../../../api/env'
  export default {
    name:'simcardTable',
    components:{
      simcardForm,
      simcardRemark,
      simAddFlow,
      simcardImport,
    },
    data() {
      return {
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
              render: (h, params) => {
                  let actions=[];

                  actions.push( h('a', {

                      style: {
                          marginRight: '5px'
                      },
                      on: {
                          click: () => {
                              this.checkSIM(params.row)
                          }
                      }
                  }, params.row.SimNum));

                  return h('div', actions);
              }
          },
          {
            align:'center',
            title: '卡状态',
            key: 'SimStatus',
          },
          {
              align:'center',
              title: '运营商',
              key: 'OperName',
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
            key: 'EffDate',
          },
          {
            align:'center',
            title: '过期时间',
            key: 'ExpDate',
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
                    this.addFlow(params.row)
                  }
                }
              }, '加油包'));
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
          SimStatus:'',
          PoolNum: '',
          SimNum: '',
          CardType:0,//1是单卡，2是流量池成员
          rows:10,
          page:1,
          CardTypeText:'单卡',
        },
        addFlowformShow:false,//修改备注窗体
        importFormShow:false, //导入窗体
      }
    },
    created(){

    },
    mounted(){
      this.getTableList();
    },
    methods: {
      resetSearch(){
        this.searchForm.PoolNum='';
        this.searchForm.SimNum='';
        this.searchForm.SimStatus='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        if(this.searchForm.CardTypeText=='单卡')
          this.searchForm.CardType=1;
        if(this.searchForm.CardTypeText=='流量池成员')
          this.searchForm.CardType=2;
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
      addFlow(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.addFlowformShow=true;
      },
      importSimCard(){
        this.importFormShow=true;
      },
      hideModel(){
        this.formShow=false;
      },
      hideRemarkModel(){
        this.addFlowformShow=false;
      },
      hideImportModel(){
        this.importFormShow=false;
      },
      doChangeCardType(){
          this.getTableList();
      },

    }
  }

</script>
