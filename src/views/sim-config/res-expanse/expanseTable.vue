
<style>
    .ivu-table .demo-table-info-row td{
        color:  #ff6600;
    }
    </style>
<template>

  <div class="expanse-config">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>

          <RadioGroup v-model="searchForm.OperType" type="button" size="large"  @on-change='doChangeOperType' >
              <Radio label="中国电信"></Radio>
              <Radio label="中国移动"></Radio>
              <Radio label="中国联通"></Radio>
            </RadioGroup>

          <Button class="top-right-btn" size="large" icon="plus" @click="addAction" v-if="IsAdmin">添加</Button>
        

      </Row>
    </div>
    <!--table-->
    <Row>
      <Table :row-class-name="rowClassName" stripe size="small" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <!--新增编辑-->
    <simExpanseConfigForm    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></simExpanseConfigForm>
        <!--订购-->       
        <exp_orderForm   :modalShow="exp_orderShow"
                     :modalFormTitle="exp_orderTitle"
                     :parentForm="exp_orderFormData"
                     @listenModalForm="hideExpModel"></exp_orderForm>
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

<style>
  .expanse-config {
    padding:10px;
    min-height:600px;
  }
</style>

<script>
  import Cookies from 'js-cookie'
  import {Res_ExpensesPagedList,delRes_Expenses} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import simExpanseConfigForm from './expanseForm.vue'
    import exp_orderForm from './exp_orderForm.vue'
  export default {
    name:'userManagement',
    components:{
      simExpanseConfigForm,
      exp_orderForm
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
            title: '运营商',
            key: 'OperType',
          },
          {
            align:'center',
            title: 'SIM类型',
            key: 'CardType',
          },
          {
            align:'center',
            title: '资费名称',
            key: 'ExpName',
          },
           {
            align:'center',
            title: '资费编号',
            key: 'ExpCode',
          },
          {
            align:'center',
            title: '资费类型',
            key: 'FlowType',
          },
          {
            align:'center',
            title: '包含流量',
            key: 'FlowSize',render: (h, params) => { return params.row.FlowSize+params.row.FLowTypeRadio;}
          },
          {
            align:'center',
            title: '标准价格(元)',
            key: 'OfficialPirce',render: (h, params) => { return params.row.OfficialPirce.toFixed(2);}
          },
          {
            align:'center',
            title: '代理商价格(元)',
            key: 'AgentPrice',render: (h, params) => { return params.row.AgentPrice.toFixed(2);}
          },
           {
            align:'center',
            title: '有效时长（月）',
            key: 'ValidMonth'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let actions=[];
              if(this.IsAdmin){
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
                      this.editAction(params.row)
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
                      this.delAction(params.row.Id)
                    }
                  }
                }, '删除'));
              }

               if(this.IsAgent){
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
                      this.buyAction(params.row)
                    }
                  }
                }, '订购'));
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
        formTitle:'添加资费配置',
        exp_orderShow:false,
        exp_orderTitle:'套餐订购',
        resetForm:{
          Id:'',
          OperType: '中国电信',
          CardType:'单卡',
          FLowTypeRadio:'MB',
          ExpName:'',
          ValidMonth:1,
          FlowSize:0,
          OfficialPirce:0,
          AgentPrice:0
        },
        parentForm:{
          Id:'',
          OperType: '',
          CardType:'',
          ExpName:'',
          ValidMonth:1,
          FlowSize:0,
          OfficialPirce:0,
          AgentPrice:0
        },
          exp_orderFormData:{
          Id:'',
          OperType:'',
          CardType:'',
          ExpName:'',
          Res_ExpensesId:0,
          SingleOrPool:'',
          Sim_Count: 20,
          FlowCount: 10,
          FlowCountUint:'MB',
          OriginSinglePrice:0,
          SinglePrice: 0,
          ChargePrice: 0,
          OrderPrice:0,
          ReceiveName:'',
          ReceiveMobile:'',
          ReceiveAddress:'',
          OrderStatus:'',
          OrderNum:'',
          RemittanceUrl:'',
          RemittancePhone:'',
          Sim_Type:1,
          ValidMonth:1,
          UseCase:'',
        },
        delModal:false,
        delId:'', //删除的Id
        btnLoading:false,
        searchForm:{
          OperType: '中国电信',
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
      doChangeOperType(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await Res_ExpensesPagedList(params);
        console.log(res)
        this.total = res.total;
        this.tableData = res.rows;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      addAction() {
        this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
        this.formTitle='添加资费配置';
                console.log(this.parentForm)
        this.formShow=true;
      },
      editAction(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='修改资费配置';
        this.formShow=true;
      },
       buyAction(row){
        //this.exp_orderFormData=JSON.parse(JSON.stringify(row));
        this.exp_orderFormData.SinglePrice=row.AgentPrice;
        this.exp_orderFormData.ValidMonth=row.ValidMonth;
        this.exp_orderFormData.FlowCount = row.FlowSize;
        this.exp_orderFormData.OriginSinglePrice=row.OfficialPirce;
        this.exp_orderFormData.OperType = row.OperType;
        this.exp_orderFormData.ExpName = row.ExpName;
        this.exp_orderFormData.SingleOrPool = row.CardType;
        this.exp_orderFormData.Res_ExpensesId = row.Id;
        this.exp_orderFormData.CardType = row.CardType;
        this.exp_orderTitle='套餐订购';
        this.exp_orderShow=true;
      },
      delAction(Id){
        this.delId=Id;
        this.delModal=true;
      },
      rowClassName (row, index) {
                if (row.OfficialPirce != row.AgentPrice) {
                    return 'demo-table-info-row';
                } 
                return '';
            },
      async comfirmDel(){
        this.btnLoading=true;
        try{
          const res= await delRes_Expenses({Id:this.delId});
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
      hideExpModel(){
        this.exp_orderShow=false;
      },
    }
  }

</script>
