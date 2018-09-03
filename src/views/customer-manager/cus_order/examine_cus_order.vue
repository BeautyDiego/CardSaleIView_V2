<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    title="审核订单"
    :mask-closable="false"
    @on-cancel="cancel"
    width="700">
    <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 35px 80px 15px 60px">
      
        <!--<Form-item label="流量池：" prop="PoolNum" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >-->
          <!--<Select v-model="modalForm.PoolNum"  >-->
            <!--<Option v-for="item in poolList" :value="item.PoolNum" :key="item.Id" :label="item.PoolNum">-->
              <!--<div>{{ item.PoolNum }}</div>-->
              <!--<div style="color:#ccc;padding-top:10px;">{{item.PoolFlowSize/1024/1024+'GB'}}&nbsp&nbsp{{item.EffDate}}~{{item.ExpDate}}</div>-->
            <!--</Option>-->
          <!--</Select>-->
        <!--</Form-item>-->
        <Form-item label="SIM卡组：" prop="SimGroupId" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}">
            <Select v-model="modalForm.SimGroupId" @on-change="onSimGroupIdChange" style="width:310px;">
                <Option v-for="item in simGroupList" :value="item.Id" :key="item.Id" :label="item.GroupName">
                </Option>
            </Select><span style="color:#e43e31">&nbsp&nbsp&nbsp包含{{simCardCount}}张SIM卡</span>
        </Form-item>
        <Form-item label="快递公司："  prop="DeliveryName" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}">
           <Input v-model="modalForm.DeliveryName" ></Input>
        </Form-item>
        <Form-item label="快递单号：" prop="DeliveryNum" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}">
          <Input v-model="modalForm.DeliveryNum" ></Input>
        </Form-item>
      
    </Form>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >关闭</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">审核通过</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {getPoolList,examineCusOrder,getSimGoupCombo,groupSimCount} from './../../../api/getData'
export default {
    components:{

    },
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            Sim_Count: 20,
            FlowCount: 10,
            SinglePrice: 0,
            ChargePrice: 0,
            OrderPrice:0,
            ReceiveName:'',
            ReceiveMobile:'',
            ReceiveAddress:'',
            OrderStatus:'',
            OrderNum:'',
            PoolNum:'',
            DeliveryName:'',
            DeliveryNum:'',
            SimGroupId:'',
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
            Id:'',
            Sim_Count: 20,
            FlowCount: 10,
            SinglePrice: 0,
            ChargePrice: 0,
            OrderPrice:0,
            ReceiveName:'',
            ReceiveMobile:'',
            ReceiveAddress:'',
            OrderStatus:'',
            OrderNum:'',
            PoolNum:'',
            DeliveryName:'',
            DeliveryNum:'',
            SimGroupId:'',
          },
          modalForm_loading:false,
          poolList:[],
          simGroupList:[],
          simCardCount:0,
        }
    },
    computed: {

    },
    watch:{
      modalShow(curVal,oldVal){
        this.IsModalShow = curVal;
        if (curVal){
          this.simCardCount = 0;
          this.modalForm=Object.assign(this.parentForm);
          console.log(this.modalForm)
          this.getSimGroupList();
        }
      },
    },
    created(){
 
    },
    mounted(){

    
    },
    methods: {
      async getPoolList(){
        this.poolList= await getPoolList({SimCount:this.modalForm.Sim_Count,PoolFlowSize:this.modalForm.FlowCount});
      },
      async getSimGroupList(){
        this.simGroupList = await getSimGoupCombo();
      },
      cancel() {
          this.$emit('listenModalExamine');
      },
      async onSimGroupIdChange(){
        if (this.modalForm.SimGroupId){
          let res = await groupSimCount({SimGroupId:this.modalForm.SimGroupId})
          this.simCardCount = res.simCount
        }
        
      },
      /*
      * @@审核订单
      * */
      saveForm(name) {
        this.$refs[name].validate( async (valid) => {
          if (valid) {
          if (this.simCardCount!=this.modalForm.Sim_Count){
              this.$Message.error('卡组与订单的sim卡数量不匹配!');
              return;
          }
            this.modalForm_loading=true;
            const params = this.modalForm;
            try{
              let result=await examineCusOrder(params);
              if (result.success) {
                this.$Message.success('提交成功!');
                this.$emit('listenModalExamine');
                this.$emit('refreshTableList');
              }else{
                this.$Message.error(result.msg);
              }
            }catch(err){
              console.log(err);
              this.$Message.error('服务器异常，稍后再试');
            }
            this.modalForm_loading=false;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
    }
}

</script>
