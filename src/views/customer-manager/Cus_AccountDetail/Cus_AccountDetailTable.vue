

<template>
  
  <div class="Cus_AccountDetail">
    <template>
      <Row>
        <Col>
        <Card style="height: 120px">
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
                <span>{{ resetForm.CustomerName }}</span>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="账户余额：" >
                <span>{{ resetForm.BeforeCash }}</span>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="余额充值：">
                <Button type="text" size="small" @click="addTopUp">充值</Button>
              </FormItem>
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
  import {Cus_AccountDetailList,editCusAccountDetail} from './../../../api/getData'
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
//        Cus_AccountDetailShow:false,
//        Cus_AccountDetailTitle:'套餐订购',
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
        this.searchForm.OperType='';
      },
       addTopUp() {
            this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
            this.formTitle='充值';
            console.log(this.parentForm)
            this.formShow=true;
        },
      doChangeOperType(){
        this.currentPage=1;
        this.getTableList();
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
      },
    }
  }

</script>
