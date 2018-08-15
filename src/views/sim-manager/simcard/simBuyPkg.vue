<style >
.ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr.ivu-table-row-highlight:nth-child(2n) td, tr.ivu-table-row-highlight.ivu-table-row-hover td{
    background-color:#CD7054;
}
.ivu-table-row-hover td{
    background-color: #CD7054;
}
.current-setting{
    font-size: 14px;
    width:40%;
    margin:0 auto;
}

.current-setting .setting-row{
    line-height: 26px;
}
.current-setting .setting-title{
    color:#bbbbbb;
}
</style>

<template>

<div>
  <Modal v-model="IsModalShow" :title="modalFormTitle" :mask-closable="false" @on-cancel="cancel" width="1000">
        <Row>
        <div style="padding-left:200px;padding-bottom:20px;">
          <Steps :current="Current_Step">
            <Step title="选购" content="选择套餐"></Step>
            <Step title="提交" content="提交后台审核"></Step>
          </Steps>
        </div>
      </Row>
    <div v-show="Current_Step==0">
       <Row style="font-size:14px;font-weight: bold;">
            <RadioGroup v-model="FlowTypeModel" type="button" size="large"  @on-change='doChangeFlowType' >
              <!--<Radio label="月包"></Radio>-->
              <Radio label="长周期包"></Radio>
              <Radio label="加油包"></Radio>
            </RadioGroup>               
      </Row>
      <Row style="font-size:14px;font-weight: bold;">
       <Table highlight-row  ref="PkgTable" stripe size="small"   :columns="pkgColums" :data="pkgData" @on-current-change="pkgDataChange"></Table>
      </Row>

      <Row style="color:red;font-size:14px;font-weight: bold" v-show="modalForm.operType=='1'">
                  电信卡只能办理流量加油包
      </Row>

     <Row style="font-size:14px;font-weight: bold;line-height:50px;">
         <RadioGroup v-model="effectNow" @on-change="effectChange">
        <Radio label="立即生效" disabled></Radio>
        <Radio label="下月生效" disabled></Radio>
    </RadioGroup>
      </Row>
       <Row style="font-size:14px;font-weight: bold" >
         SIM卡有效期&nbsp&nbsp<InputNumber :max="120" :min="1" v-model="selectedMonth" :disabled="FlowTypeModel=='长周期包'||FlowTypeModel=='加油包'"></InputNumber>个月
       </Row>
    </div>
    <div v-show="Current_Step==1">
        <Card :bordered="true" style="background-color: #fafafa">
            <div class="current-setting">
                <Row class="setting-row"><Col span="12" class="setting-title">套餐名称：</Col><Col span="12"> {{modalForm.NewPkgName}}</Col> </Row>
                <Row class="setting-row"><Col span="12" class="setting-title">SIM卡数量：</Col><Col span="12"> {{modalForm.SimCount}}</Col> </Row>
                <Row class="setting-row"><Col span="12" class="setting-title">SIM卡有效期：</Col><Col span="12"> {{selectedMonth}} 个月</Col></Row>
                <Row class="setting-row"><Col span="12" class="setting-title">单价：</Col><Col span="12"> {{modalForm.SinglePrice}} 元</Col></Row>
                <Row class="setting-row"><Col span="12" class="setting-title">总金额：</Col><Col span="12">  {{modalForm.TotalPrice}} 元</Col></Row>
                <Row class="setting-row"><Col span="12" class="setting-title">当前余额：</Col><Col span="12"> {{RestCash}} 元</Col></Row>
            </div>

            <!--<Row style="font-size:14px;font-weight: bold">-->
                <!--套餐名称：{{modalForm.NewPkgName}}-->
            <!--</Row>-->
            <!--<Row style="font-size:14px;font-weight: bold">-->
                <!--SIM卡数量：{{modalForm.SimCount}}-->
            <!--</Row>-->
            <!--<Row style="font-size:14px;font-weight: bold">-->
                <!--SIM卡有效期：{{selectedMonth}} 个月&nbsp&nbsp&nbsp-->
            <!--</Row>-->
            <!--<Row style="font-size:14px;font-weight: bold">-->
                <!--单价：{{modalForm.SinglePrice}} 元&nbsp&nbsp&nbsp-->
            <!--</Row>-->
            <!--<Row style="font-size:14px;font-weight: bold">-->
                <!--总金额：{{modalForm.TotalPrice}} 元&nbsp&nbsp&nbsp-->
            <!--</Row>-->
            <!--<Row style="font-size:14px;font-weight: bold">-->
                <!--当前余额：{{RestCash}} 元&nbsp&nbsp&nbsp-->
            <!--</Row>-->
        </Card>
    </div>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
      <Button type="error" v-show="Current_Step==0"  @click="nextClick" >下一步</Button>
      <Button type="primary"  :loading="modalForm_loading" v-show="Current_Step==1" @click="SubmitPkgOrder">提交审核</Button>
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
             maxFlow:0,
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
        effectNow:"下月生效",
        FlowTypeModel:'长周期包',
        selectedMonth:1,
        }

    },

    watch:{
      modalShow(curVal,oldVal){
        this.IsModalShow = curVal;
        if(curVal){
           this.modalForm = Object.assign(this.parentForm);       

           this.Current_Step=0;
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
        if(currentRow.FlowType!='加油包'){
/*           if(this.parentForm.maxFlow>currentRow.FlowCount){//已有套餐大于所选套餐时
                  console.log(this.parentForm.maxFlow)
                  console.log(currentRow.FlowCount)
          } */

        }

        this.isSelected=true;
        this.modalForm.NewPkgCode=currentRow.ExpCode;
        this.modalForm.NewPkgName=currentRow.ExpName;
        this.modalForm.SinglePrice=currentRow.AgentPrice;
        this.modalForm.TotalPrice = currentRow.AgentPrice*this.parentForm.selectSims.length;
        this.modalForm.SimCount = this.parentForm.selectSims.length;
        this.selectedMonth = currentRow.ValidMonth;

      },
      effectChange(){
        console.log( this.effectNow)
      },
      doChangeFlowType(){
        if(this.FlowTypeModel=='月包'){
          this.effectNow='下月生效';
        }else{
          this.effectNow='立即生效';
        }
        this.selectedMonth=1;
        this.getPkgList();
    
      },
      async getPkgList(){
        const res = await Res_ExpensesPagedList({'page':1,'rows':'1000','OperType':this.parentForm.operType,'cardtype':1,'FlowType':this.FlowTypeModel});
        this.pkgData = res.rows;
      },
      async GetOrderRestCash(){
          let res = await getCusRestCash(this.modalForm);
          if (res.success){
            this.RestCash = res.result.toFixed(2);
          } 
      },
      
      async SubmitPkgOrder(){

        if(this.effectNow=="立即生效")
          this.modalForm.effectNow = 1;
        else
          this.modalForm.effectNow = 0;
        let TotalSimNum=this.parentForm.selectSims.map((v, i, a) => {
            return v.SimNum
        });
        this.modalForm.ValidMonth=this.selectedMonth;
        this.modalForm.TotalSimNum=TotalSimNum.join(',');
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
                    this.$emit('listenModalForm');
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
        if(this.isSelected){
        
        if(this.FlowTypeModel=='月包'){
          this.modalForm.TotalPrice =this.modalForm.TotalPrice * this.selectedMonth;
        }
          this.Current_Step +=1;
        }
     
        else
          this.$Message.error('请选择一种资费。');


      },
    }
}

</script>
