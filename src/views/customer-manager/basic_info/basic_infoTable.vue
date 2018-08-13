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
          <Button class="top-right-btn" size="large" icon="plus"  @click="addUser" v-if="!IsCustomer">添加</Button>
          <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
            <Button type="primary" size="large" icon="ios-search">搜  索</Button>
            <div style="text-align:center" slot="content">
              <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
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
    <Row><Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="tableData"></Table>
      
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
     <discount-form    :modalShow="discountShow"
                 :parentForm="parentForm"
                 @listenModalForm="hideDiscount" ></discount-form>
                
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
  import { mapState } from 'vuex'
  import {customerBasicInfoList,delCustomer,resetUserPwd} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import basic_infoForm from './basic_infoForm.vue'
  import discountForm from './discountForm.vue'
  import expandRow from './basicExpendRow.vue';
  export default {
    name:'basic_Info',
    components:{
      basic_infoForm,
      discountForm,
      expandRow
    },
    data() {
      return {
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
            title: '登录名',
            key: 'LoginName',
          },
          {
              align:'center',
              title: '所属企业',
              key: 'Company'
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
              title: '创建人',
              key: 'JoinBy',
          },
          {
              align:'center',
              title: '创建时间',
              key: 'JoinDate',
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let actions=[];
              if (this.IsAdmin){
                actions.push(  h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.setDiscount(params.row)
                    }
                  }
                }, '折扣率'));
                actions.push( h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
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
        discountShow:false,
        formTitle:'添加用户',
        parentForm:{
          Id:'',
          Cus_Name: '',
          LoginName: '',
          Cus_Address: '',
          Company:'',
          Industry: '',
          Region: '',
          ManagerName: '',
          ManagerEmail: '',
          ManagerEmailKey:'',
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
      ...mapState({
        adminInfo: state => state.user.adminInfo,
      }),
      IsCustomer:function () {
        return this.adminInfo.OwerType==3;
      }
    },
    created(){
    },
    mounted(){
      this.getTableList();
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
      setDiscount(row) {
      this.parentForm=JSON.parse(JSON.stringify(row));
       
        this.discountShow=true;
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
      hideDiscount(){
        this.discountShow=false;
      }
    }
  }

</script>
