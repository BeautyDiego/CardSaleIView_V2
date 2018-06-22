<style>
  
  .basic_Info {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="basic_Info">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
          <Button class="top-right-btn" size="large" icon="plus"  @click="addUser" v-if="IsAdmin">添加</Button>
          <Button @click="searchEnter"   class="top-btn" size="large" icon="search"  >搜索</Button>
        </Col>
        <transition name="fade">
          <Card v-show="searchPaneShow" style="position:absolute;top:1px;z-index:100;right:185px;" :style="{ right: IsAdmin?'185px':'88px'}" :padding=12>
            <p style="text-align:center;margin-bottom:10px;"><Icon type="search"></Icon>搜索</p>
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:400px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
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
    <basic_info-form    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></basic_info-form>
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
        <Button type="error" size="large" long  :loading="btnLoading"  @click="comfirmDel">删除</Button>
      </div>
    </Modal>
    <!--是否重置密码框-->
    <!--<Modal v-model="resetModal" width="360">-->
      <!--<p slot="header" style="color:#f60;text-align:center">-->
        <!--<Icon type="information-circled"></Icon>-->
        <!--<span>重置确认</span>-->
      <!--</p>-->
      <!--<div style="text-align:center">-->
        <!--<p>重置后该用户密码为123456,是否继续？</p>-->
      <!--</div>-->
      <!--<div slot="footer">-->
        <!--<Button type="warning" size="large" long  @click="comfirmReset">重置</Button>-->
      <!--</div>-->
    <!--</Modal>-->
  </div>

</template>

<script>
  import Cookies from 'js-cookie'
  import {customerBasicInfoList,delCustomer,resetUserPwd} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import basic_infoForm from './basic_infoForm.vue'
  export default {
    name:'basic_Info',
    components:{
      basic_infoForm,
    },
    data() {
      return {
        searchPaneShow:false,
        tableLoading:false,
        tableColums: [
          {
            align:'center',
            title: '客户名称',
            key: 'Cus_Name',
          },
          {
            align:'center',
            title: '登录名',
            key: 'LoginName',
          },
          {
            align:'center',
            title: '折扣',
            key: 'Discount',
          },
          {
            align:'center',
            title: '客户地址',
            key: 'Cus_Address',
          },
          {
            align:'center',
            title: '行业',
            key: 'Industry'
          },
          {
            align:'center',
            title: '区域',
            key: 'Region',
          },
          {
            align:'center',
            title: '负责人姓名',
            key: 'ManagerName',
          },
          {
            align:'center',
            title: '负责人电话',
            key: 'ManagerMobile',
          },
          {
            align:'center',
            title: '负责人邮箱',
            key: 'ManagerEmail',
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
                      this.editUser(params.row)
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
                      this.delCustomer(params.row.Id)
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

        },
        delModal:false,
        delId:'', //删除的Id
        resetModal:false,
        resetId:'',//密码重置Id
        btnLoading:false,
        searchForm:{
          cus_Name: '',
          rows:10,
          page:1,
        },
      }
    },
    computed:{
      IsAdmin: function () {
        return  Cookies.get('roleName')=='管理员';
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
        const res = await customerBasicInfoList(params);
        console.log(res)
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      addUser() {
        clearObj(this.parentForm);
       // this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
        this.formTitle='添加客户';
        this.formShow=true;
      },
      editUser(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='修改客户';
        this.formShow=true;
      },
      delCustomer(Id){
        this.delId=Id;
        this.delModal=true;
      },
      async comfirmDel(){
        this.btnLoading=true;
        try{
          const res= await delCustomer({Id:this.delId});
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
      resetUserPwd(Id){
        this.resetId=Id;
        this.resetModal=true;
      },
      async comfirmReset(){
        this.btnLoading=true;
        try{
          const res= await resetUserPwd({Id:this.resetId});
          if (res.success) {
            this.$Message.success('重置成功!');
            this.resetModal=false;
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
