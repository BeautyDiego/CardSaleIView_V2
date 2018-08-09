<style >
.ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr.ivu-table-row-highlight:nth-child(2n) td, tr.ivu-table-row-highlight.ivu-table-row-hover td{
    background-color:#CD7054;
}
.ivu-table-row-hover td{
    background-color: #CD7054;
}
</style>

<template>

<div>
  <Modal v-model="IsModalShow":title="modalFormTitle" :mask-closable="false" @on-cancel="cancel" width="1000">
        <Row>
        <div style="padding-left:105px;padding-bottom:20px;">
          <Steps :current="this.Current_Step">
            <Step title="选购" content="选择套餐"></Step>
            <Step title="提交" content="提交后台审核"></Step>
          </Steps>
        </div>
      </Row>
    <div v-show="this.Current_Step==0">
      <Row style="font-size:14px;font-weight: bold">
       <Table highlight-row  ref="PkgTable" stripe size="small"   :columns="pkgColums" :data="pkgData" @on-current-change="pkgDataChange"></Table>
      </Row>
    </div>
    <div v-show="this.Current_Step==1">
       <Row style="font-size:14px;font-weight: bold">
                  套餐名称：{{this.modalForm.NewPkgName}}
      </Row>
      <Row style="font-size:14px;font-weight: bold">
                  SIM卡数量：{{this.modalForm.SimCount}}
      </Row>
     <Row style="font-size:14px;font-weight: bold">
                  单价：{{this.modalForm.SinglePrice}} 元&nbsp&nbsp&nbsp
      </Row>
      <Row style="font-size:14px;font-weight: bold">
                  总金额：{{this.modalForm.TotalPrice}} 元&nbsp&nbsp&nbsp
      </Row>
      <Row style="font-size:14px;font-weight: bold">
                  当前余额：{{RestCash}} 元&nbsp&nbsp&nbsp
      </Row>
    </div>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
      <Button type="error" v-show="this,Current_Step==0"  @click="nextClick" >下一步</Button>
      <Button type="primary"  :loading="modalForm_loading" v-show="this,Current_Step==1" @click="SubmitPkgOrder">提交审核</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {addSimPkgOrder,Res_ExpensesPagedList,getCusRestCash} from './../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
             operType:'1',
             selectSims:[],

             
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '套餐办理',
      },
    },
    data() {
        return {
          Current_Step:0,
          RestCash:0,
          IsModalShow:false,
          modalForm:{
          },
          modalForm_loading:false,
           pkgData:[],
          pkgColums: [
          {
            type: 'index',
            width: 60,
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
            title: '价格(元)',
            key: 'AgentPrice',render: (h, params) => { return params.row.AgentPrice.toFixed(2);}
          },
           {
            align:'center',
            title: '有效时长（月）',
            key: 'ValidMonth'
          }],
        cpaySelectRow:[],
        searchForm:{
          SimStatus:'',
          CardType:'1',//1是单卡，2是流量池成员
          rows:20,
          page:1,
          OperType:'1'
        },
        isSelected:false,
        }
    },

    watch:{
      modalShow(curVal,oldVal){
        this.IsModalShow = curVal;
        if(curVal){
           this.modalForm = Object.assign(this.parentForm);       
           this.currentStep=0;
           this.isSelected=false;
           this.getPkgList();
           this.GetOrderRestCash();
        }
      }
    },
    created(){

    },
    mounted(){
        this.getPkgList();
    },
    methods: {
      cancel() {
          this.$emit('listenModalForm');
      },
      pkgDataChange(currentRow,oldCurrentRow){
        this.isSelected=true;
        this.modalForm.NewPkgCode=currentRow.ExpCode;
        this.modalForm.NewPkgName=currentRow.ExpName;
        this.modalForm.SinglePrice=currentRow.AgentPrice;
        this.modalForm.TotalPrice = currentRow.AgentPrice*this.parentForm.selectSims.length;
        this.modalForm.SimCount = this.parentForm.selectSims.length;

      },
      async getPkgList(){
        const res = await Res_ExpensesPagedList({'page':1,'rows':'1000','OperType':this.parentForm.operType,'cardtype':1});
        this.pkgData = res.rows;
      },
      async GetOrderRestCash(){
          let res = await getCusRestCash(this.modalForm);
          if (res.success){
            this.RestCash = res.result.toFixed(2);
          } 
      },
      
      async SubmitPkgOrder(){
        if(!this.isSelected){
          this.$Message.error('请选择一种资费。');
          return;
        }
         

          console.log(this.modalForm)
          if (parseFloat(this.RestCash)<parseFloat(this.modalForm.TotalPrice.toFixed(2))){
              this.$Notice.error({
                  title: '支付失败',
                  desc: '余额不足，请到充值管理页面充值余额 '
              });
          }else{
             this.modalForm_loading=true;
              let res = await addSimPkgOrder(this.modalForm);
              if (res.success){
                  this.$Notice.success({
                      title: '支付成功',
                      desc: '余额支付成功，请等待后台审核订单。 '
                  });
                  this.currentStep=3;
              }else
              {
                  this.$Notice.error({
                      title: '支付失败',
                      desc: '余额支付失败，请联系管理员。'
                  });
              }
              this.IsModalShow=false;
              this.modalForm_loading=false;
          }
      },
      nextClick(){
        this.Current_Step +=1;
      },
    }
}

</script>
