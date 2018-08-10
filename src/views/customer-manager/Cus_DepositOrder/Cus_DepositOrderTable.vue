<style>

  .Cus_DepositOrder {
    padding:10px;
    min-height:600px;
  }

</style>

<template>

  <div class="Cus_DepositOrder">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
        <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
          <Button type="primary" size="large" icon="ios-search">搜  索</Button>
          <div style="text-align:center" slot="content">
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="订单编号"  >
                  <Input v-model="searchForm.DepositOrderNum" ></Input>
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
  </div>

</template>

<script>
    import Cookies from 'js-cookie'
    import {Cus_DepositOrderList,addCusDepositOrder} from './../../../api/getData'
    import {clearObj} from './../../../libs/util';
    export default {
        name:'Res_Operator',
        components:{
    },
        data() {
            return {
                searchPaneShow:false,
                tableLoading:false,
                tableColums: [
                    {
                        type: 'index',
                        width: 60,
                        title: '序号',
                        align: 'center'
                     },
                    {
                        align:'center',
                        title: '订单编号',
                        key: 'DepositOrderNum',
                    },
                    {
                        align:'center',
                        title: '充值金额',
                        key: 'AmountMoney',
                    },
                    {
                        align:'center',
                        title: '订单状态',
                        key: 'OrderStatus'
                    },
                    {
                        align:'center',
                        title: '订单时间',
                        key: 'OrderTime',
                    },
                    {
                        align:'center',
                        title: '支付方式',
                        key: 'PayMode'
                    },
                    {
                        align:'center',
                        title: '支付时间',
                        key: 'PayTime'
                    },
                    {
                        align:'center',
                        title: '银行流水号',
                        key: 'BankFlowNum'
                    },
                    {
                        align:'center',
                        title: '备注',
                        key: 'Remark'
                    },
                ],
                tableData: [
                ],
                total:0,
                currentPage:1,
                formShow:false,
                formTitle:'添加运营商',
                parentForm:{
                    Id:'',
                    Cus_CustomerId: '',
                    OrderStatus: '1',
                    DepositOrderNum: '',
                    AmountMoney: '',
                    OrderTime: '',
                    PayTime: '',
                    BankFlowNum: '',
                    PayMode:'1',
                    WxQRUrl:'',
                    AlipayQRUrl:'',
                    UnionQRUrl:'',
                    Remark:'',

                },
                delModal:false,
                delId:'', //删除的Id
                resetModal:false,
                btnLoading:false,
                searchForm:{
                    DepositOrderNum:'',
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
            searchEnter(){
                this.searchPaneShow=!this.searchPaneShow;
            },
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
                const res = await Cus_DepositOrderList(params);
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
