<style>
  
  .userManagement {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="userManagement">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
          <Button class="top-right-btn" size="large" icon="plus" @click="addUser">添加</Button>
          <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
            <Button type="primary" size="large" icon="ios-search">搜  索</Button>
            <div style="text-align:center" slot="content">
              <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                <Row>
                  <Form-item label="用户名称"  >
                    <Input v-model="searchForm.uName" ></Input>
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
      <Table stripe size="small" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <!--新增编辑-->
    <userForm    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></userForm>
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
    <!--是否重置密码框-->
    <Modal v-model="resetModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>重置确认</span>
      </p>
      <div style="text-align:center">
        <p>重置后该用户密码为123456,是否继续？</p>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" long :loading="btnLoading"  @click="comfirmReset">重置</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import Cookies from 'js-cookie'
  import {userPagedList,delUser,resetUserPwd} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import userForm from './userForm.vue'
  export default {
    name:'userManagement',
    components:{
      userForm,
    },
    data() {
      return {
        tableColums: [
          {
            align:'center',
            title: '用户名称',
            key: 'UserName',
          },
          {
            align:'center',
            title: '登录名',
            key: 'LoginName',
          },
          {
            align:'center',
            title: '性别',
            key: 'Sex',
            render: (h, params) => {
              let gender=params.row.Sex===1?'男':params.row.Sex===2?'女':'未填写';
              return h('span',gender);
            }
          },
          {
            align:'center',
            title: '电话',
            key: 'Mobile',
          },
          {
            align:'center',
            title: '角色',
            key: 'RoleName',
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
                      this.editUser(params.row)
                    }
                  }
                }, '修改'));
              if (params.row.Id!==1&&params.row.Id!=this.UserId){
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
                      this.delUser(params.row.Id)
                    }
                  }
                }, '删除'));
              }
               
            
                actions.push(  h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.resetUserPwd(params.row.Id)
                    }
                  }
                }, '重置密码'));
              
              
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
        resetForm:{
          Id:'',
          UserName: '',
          LoginName: '',
          Password:'',
          Mobile:'',
          Sex:'',
          DepartMentId:'',
          Rbac_RoleId:1,
        },
        parentForm:{
          Id:'',
          UserName: '',
          LoginName: '',
          Pwd:'',
          PhoneNum:'',
          Sex:'',
          DepartMentId:'',
          Rbac_RoleId:'',
        },
        delModal:false,
        delId:'', //删除的Id
        resetModal:false,
        resetId:'',//密码重置Id
        btnLoading:false,
        searchForm:{
          uName: '',
          rows:10,
          page:1,
        },
      }
    },
    computed: {
      UserId: function () {
        return  Cookies.get('userId');
      },
    },
    created(){

    },
    mounted(){
      this.getTableList();
    },
    methods: {
      resetSearch(){
         this.searchForm.uName='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await userPagedList(params);
        this.total = res.total;
        this.tableData = res.rows;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      addUser() {
        clearObj(this.parentForm);
       // this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
        this.formTitle='添加用户';
        this.formShow=true;
      },
      editUser(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='修改用户';
        this.formShow=true;
      },
      delUser(Id){
        this.delId=Id;
        this.delModal=true;
      },
      async comfirmDel(){
        this.btnLoading=true;
        try{
          const res= await delUser({Id:this.delId});
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
