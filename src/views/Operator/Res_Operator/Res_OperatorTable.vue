<style>
  
  .Res_Operator {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="Res_Operator">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
          <Button class="top-right-btn" size="large" icon="plus"  @click="addResOperator">添加</Button>
          <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
            <Button type="primary" size="large" icon="ios-search">搜  索</Button>
            <div style="text-align:center" slot="content">
              <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                <Row>
                  <Form-item label="运营商名称"  >
                    <Input v-model="searchForm.OperName" ></Input>
                  </Form-item>
                </Row>
                <Row>
                  <Form-item label="联系人姓名"  >
                    <Input v-model="searchForm.ContactName" ></Input>
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
    <!--新增编辑-->
    <Res_Operator-form    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></Res_Operator-form>
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
        <Button type="error" size="large" long  :loading="btnLoading"  @click="ResOperatorDel">删除</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {ResOperatorList,delResOperator,addResOperator,editResOperator} from '../../../api/getData'
  import {clearObj} from '../../../libs/util';
  import Res_OperatorForm from './Res_OperatorForm.vue'
  export default {
    name:'Res_Operator',
    components:{
      Res_OperatorForm,
    },
    data() {
      return {
        tableLoading:false,
        tableColums: [
          {
            align:'center',
            title: '运营商名称',
            key: 'OperName',
          },
          {
            align:'center',
            title: '运营商类型',
            key: 'OperType',
          },
            {
                align:'center',
                title: '用户姓名',
                key: 'UserName'
            },
          {
            align:'center',
            title: '用户密码',
            key: 'UserPwd',
          },
            {
                align:'center',
                title: '联系人电话',
                key: 'ContactName'
            },
          {
            align:'center',
            title: '联系人电话',
            key: 'ComtactMobile'
          },
            {
                align:'center',
                title: '运营商地址',
                key: 'OperUrl'
            },
            {
                align:'center',
                title: 'AppKEY',
                key: 'AppKey'
            },
            {
                align:'center',
                title: 'AppSecret',
                key: 'AppSecret'
            },
            {
                align:'center',
                title: 'IP端口',
                key: 'IPAndPort'
            },
            {
                align:'center',
                title:'集团编码',
                key:'GroupCode',
            },
          {
            align:'center',
            title: '状态',
            key: 'Enabled',
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let actions=[];
              if (this){
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
                      this.editResOperator(params.row)
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
                      this.delResOperator(params.row.Id)
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
        formTitle:'添加运营商',
        parentForm:{
          Id:'',
          OperName: '',
          OperType: '1',
          ContactName: '',
          ComtactMobile: '',
            AppKey: '',
          UserName: '',
          UserPwd: '',
          Enabled:'1',
            OperUrl:'',
            AppSecret:'',
            IPAndPort:'',
            GroupCode:'',

        },
        delModal:false,
        delId:'', //删除的Id
        resetModal:false,
        btnLoading:false,
        searchForm:{
          OperName: '',
          OperType: 0,
          ContactName:'',
          rows:10,
          page:1,
        },
      }
    },
    computed:{
      },
    created(){
    },
    mounted(){
      this.getTableList();
    },
    methods: {
      resetSearch(){
         this.searchForm.OperName='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await ResOperatorList(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      addResOperator() {
        clearObj(this.parentForm);
       // this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
        this.formTitle='添加运营商';
        this.formShow=true;
      },
      editResOperator(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='修改运营商';
        this.formShow=true;
      },
      delResOperator(Id){
        this.delId=Id;
        this.delModal=true;
      },
      async ResOperatorDel(){
        this.btnLoading=true;
        try{
          const res= await delResOperator({Id:this.delId});
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
    }
  }

</script>
