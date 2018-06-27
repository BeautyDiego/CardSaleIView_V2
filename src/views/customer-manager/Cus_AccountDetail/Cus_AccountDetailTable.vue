<style>
  
  .Cus_AccountDetail {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="Cus_AccountDetail">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
          <!--<Button class="top-right-btn" size="large" icon="plus"  @click="addUser" v-if="IsAdmin">充值</Button>-->
          <Button @click="searchEnter"   class="top-btn" size="large" icon="search"  >搜索</Button>
        </Col>
        <transition name="fade">
          <Card v-show="searchPaneShow" style="position:absolute;top:1px;z-index:100;right:185px;" :style="{ right: IsAdmin?'185px':'88px'}" :padding=12>
            <p style="text-align:center;margin-bottom:10px;"><Icon type="search"></Icon>搜索</p>
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:400px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="用户名称"  >
                  <Input v-model="searchForm.CustomerName" ></Input>
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
    <Cus_AccountDetail-form    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></Cus_AccountDetail-form>
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
  import {Cus_AccountDetailList,delCus_AccountDetail} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import Cus_AccountDetailForm from './Cus_AccountDetailForm.vue'
  export default {
    name:'basic_Info',
    components:{
      Cus_AccountDetailForm,
    },
    data() {
      return {
        searchPaneShow:false,
        tableLoading:false,
        tableColums: [
          {
            align:'center',
            title: '客户名称',
            key: 'CustomerName',
          },
          {
            align:'center',
            title: '类型',
            key: 'ActionType',
          },
          {
            align:'center',
            title: '渠道',
            key: 'Channel',
          },
          {
            align:'center',
            title: '消费或新增金额',
            key: 'AccountCash',
          },
          {
            align:'center',
            title: '变动前余额',
            key: 'RestCash',
          },
          {
            align:'center',
            title: '变动后余额',
            key: 'AfterCash',
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
                }, '充值'));

//                actions.push(  h('Button', {
//                  props: {
//                    type: 'error',
//                    size: 'small'
//                  },
//                  style: {
//                    marginRight: '5px'
//                  },
//                  on: {
//                    click: () => {
//                      this.delCus_AccountDetail(params.row.Id)
//                    }
//                  }
//                }, '删除'));
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
//        formTitle:'添加用户',
        parentForm:{
          Id:'',
          CustomerId: '',
          CustomerName: '',
          ActionType: '',
          Channel: '',
          AccountCash: '',
          BeforeCash: '',
          AfterCash: '',
          Remark:'',
          RestCash:''
        },
        delModal:false,
//        delId:'', //删除的Id
        resetModal:false,
//        resetId:'',//密码重置Id
        btnLoading:false,
        searchForm:{
          CustomerName: '',
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
      async GetCusAccountDetail(Id){
        const params = {Id:Id}
        const res = await GetCusAccountDetail(params);
      },
      resetSearch(){
         this.searchForm.CustomerName='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await Cus_AccountDetailList(params);
        console.log(res)
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
//      addUser() {
//        clearObj(this.parentForm);
//       // this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
//        this.formTitle='客户充值';
//        this.formShow=true;
//      },
      editUser(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='充值';
        this.formShow=true;
      },
//      delCus_AccountDetail(Id){
//        this.delId=Id;
//        this.delModal=true;
//      },
//      async comfirmDel(){
//        this.btnLoading=true;
//        try{
//          const res= await delCus_AccountDetail({Id:this.delId});
//          if (res.success) {
//            this.$Message.success('删除成功!');
//            this.getTableList();
//            this.delModal=false;
//          }else{
//            this.$Message.error(res.msg);
//          }
//        }catch(err){
//          console.log(err);
//          this.$Message.error('服务器异常，稍后再试');
//        }
//        this.btnLoading=false;
//      },
//      resetUserPwd(Id){
//        this.resetId=Id;
//        this.resetModal=true;
//      },
//      async comfirmReset(){
//        this.btnLoading=true;
//        try{
//          const res= await resetUserPwd({Id:this.resetId});
//          if (res.success) {
//            this.$Message.success('重置成功!');
//            this.resetModal=false;
//          }else{
//            this.$Message.error(res.msg);
//          }
//        }catch(err){
//          console.log(err);
//          this.$Message.error('服务器异常，稍后再试');
//        }
//        this.btnLoading=false;
//      },
      hideModel(){
        this.formShow=false;
      },
    }
  }

</script>
