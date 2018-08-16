

<template>
  
  <div class="Cus_AccountDetail">
    <template>
      <Row>
        <Col>
        <Card style="height: 120px" v-if="IsAgent">
          <p slot="title">账户明细</p>
          <div>
            <Form
                    ref="resetForm"
                    :model="resetForm"
                    :label-width="200"
                    label-position="right"
                    :rules="inforValidate"
            >
              <Col span="6">
              <FormItem label="用户姓名：" >
                <span>{{ myAccountForm.Cus_Name }}</span>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="账户余额：" >
                <span>{{ myAccountForm.RestCash }}</span>
              </FormItem>
              </Col>
              <Col span="6">

                <Button type="success" size="large" @click="addTopUp">余额充值</Button>

              </Col>
            </Form>
          </div>
        </Card>
        </Col>
      </Row>
    </template>
    <!--table-->
    <Row>
      <Table stripe size="small" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <!--充值-->
    <Cus_AccountDetailForm   :modalShow="formShow"
                     :modalFormTitle="formTitle"
                     :parentForm="parentForm"
                     @listenModalForm="hideModel">
                     @refreshTableList="getTableList" ></Cus_AccountDetailForm>
  </div>

</template>

<style>
  .Cus_AccountDetail {
    padding:10px;
    min-height:600px;
  }
</style>

<script>
  import Cookies from 'js-cookie'
  import { mapState } from 'vuex'
  import {Cus_AccountDetailList,editCusAccountDetail,GetCustomer} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import Cus_AccountDetailForm from './Cus_AccountDetailForm.vue'
  export default {
    name:'userManagement',
    components:{
        Cus_AccountDetailForm,
    },
    data() {
      return {
        searchPaneShow:false,
        tableColums: [
         {
              type: 'index',
              width: 60,
              title: '序号',
              align: 'center'
          },
          {
            align:'center',
            title: '动作类型',
            key: 'ActionType',
          },
          {
            align:'center',
            title: '充值渠道',
            key: 'Channel',
          },
          {
            align:'center',
            title: '消费或充值金额',
            key: 'AccountCash',
          },
            {
                align:'center',
                title: '余额',
                key: 'BeforeCash',
            },
          {
            align:'center',
            title: '变动后余额(元)',
            key: 'AfterCash',
          },
          {
            align:'center',
            title: '备注',
            key: 'Remark',
          },
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        formShow:false,
        formTitle:'添加充值',
        resetForm:{
          Id:'',
          CustomerId: '',
          CustomerName:'',
          ActionType:'0',
          Channel:'0',
          BeforeCash:'',
          AccountCash:'',
          AfterCash:'',
          Remark:'',
        },
        myAccountForm:{
          Id:'',
          Cus_Name:'',
          RestCash:0,
        },
        parentForm:{
          Id:'',
          CustomerId: '',
          CustomerName:'',
          ActionType:'0',
          Channel:'0',
          AccountCash:'',
          AfterCash:'',
          Remark:'',
        },
        Cus_AccountDetailFormData:{
          Id:'',
          CustomerId: '',
          CustomerName:'',
          ActionType:'0',
          Channel:'0',
          AccountCash:'',
          AfterCash:'',
          Remark:'',
        },
        delModal:false,
        delId:'', //删除的Id
        btnLoading:false,
        searchForm:{
            CustomerName: '',
          rows:10,
          page:1,
        }
      }
    },
    computed:{
      IsAdmin: function () {
        return  Cookies.get('roleName')=='管理员';
      },
      IsAgent: function () {
        return  Cookies.get('roleName')=='代理商';
      },
      ...mapState({
          adminInfo: state => state.user.adminInfo,
      }),
    },
    created(){

    },
    mounted(){
      this.getCustomerAccount();
      this.getTableList();
    },
    methods: {
      searchEnter(){
        this.searchPaneShow=!this.searchPaneShow;
      },
      resetSearch(){
        this.searchForm.OperType='';
      },
       addTopUp() {
            this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
            this.formTitle='充值';
            this.formShow=true;
        },
      doChangeOperType(){
        this.currentPage=1;
        this.getTableList();
      },
        async getCustomerAccount(){
          this.myAccountForm = await GetCustomer({userId:this.adminInfo.Id})
        },
      async getTableList(){
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await Cus_AccountDetailList(params);
        console.log(res)
        this.total = res.total;
        this.tableData = res.rows;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },

      hideModel(){
        this.formShow=false;
        this.getCustomerAccount();//刷新一下账户
      },
    }
  }

</script>
