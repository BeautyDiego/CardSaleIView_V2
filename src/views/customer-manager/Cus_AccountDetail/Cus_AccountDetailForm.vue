<style scoped>
  .pay-part{}
  .pay-part h2{
    padding:10px;
  }
  .fee-scale tr td{
    text-align: center;
  }
  .wepay-logo{
    width:120px;
  }
  .wepay-instruction{
    width:150px;
  }
  .pay-success{
    padding:10px 20px;
  }
  .pay-success .text-center{
    text-align: center;
    padding:5px;
  }

  
</style>

<template>
  <div>  
    <Modal
            v-model="IsModalShow"
            :mask-closable="false"
            :title="modalFormTitle"
            @on-cancel="cancel"
            width="850">
      <Row>
        <div style="padding-left:65px;">
          <Steps :current="currentStep" >
            <Step title="下单"></Step>
            <Step title="支付订单"></Step>
            <Step title="完成"></Step>
          </Steps>
        </div>
      </Row>
      
      <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 35px 30px 5px">
        <div v-show="currentStep==0">
          <Row>
                <Form-item label="充值金额：" prop="Cash" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
                    ￥<InputNumber v-model="modalForm.Cash" :min='0' :max='1000000' >元</InputNumber>
            </Form-item>
              <Row>
              </Row>
          </Row>
        
        </div>
      </Form>
      <div class="pay-part" v-show="currentStep==1">
        <h2>收银台</h2>
        <Row style="background-color: #f2f2f2;padding:20px;">
          <Col span="6" style="line-height: 36px;">
          <Row>应付金额：￥{{modalForm.Cash}}</Row>
          </Col>
        </Row>
        <Tabs v-model="tabValue"  @on-click="GetOrderAliQRCode">
          <TabPane label="微信支付" name="name1">
            <div>
              <img src="./../../../images/WePayLogo.png" class="wepay-logo" alt="">
              <div style="width:100%; text-align: center;">
                <div>
                  <img :src="WxQRCode"  >
                </div>
                <div>
                  <img src="./../../../images/WePayInstruction.png" class="wepay-instruction" alt="" >
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="支付宝" name="name2">
            <div>
              <img src="./../../../images/alipayLogo.jpg" class="wepay-logo" alt="">
              <div style="width:100%; text-align: center;">
                <div>
                  <img :src="AliQRCode">
                </div>
                <div>
                  <img src="./../../../images/alipayInstruction.jpg" class="wepay-instruction" alt="" >
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <!--充值成功-->
      <div class="pay-success" v-if="currentStep==2">
        <div>
          <Row>
            <Col span="3">
            <Icon type="ios-checkmark" :size="50" color="#00c800"></Icon>
            </Col>
            <Col span="12">
            <h3 style="margin-top:14px;">恭喜你，支付成功</h3>
            </Col>
          </Row>
          <Row style="padding:5px;">详细信息如下：</Row>
          <Row style="border-top:1px solid #cccccc;padding-top:10px;">

            <Col span="12" class="text-center">
            订单编号
            </Col>
            <Col span="6" class="text-center">
            金额（元）
            </Col>
          </Row>
          <Row style="border-bottom:1px solid #cccccc;padding-bottom:10px;">
            <Col span="12" class="text-center">
            {{this.PayOrderNum}}
            </Col>
            <Col span="6" class="text-center">
            <span style="color:#e4393c">￥{{modalForm.Cash}}</span>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="footer">
        <Button type="ghost"   @click="cancel" >取消</Button>
        <Button type="ghost" :loading="modalForm_loading"  @click="prevStep" v-show="currentStep==1">上一步</Button>
        <Button type="ghost" :loading="modalForm_loading"  @click="nextStep" v-show="currentStep==0">下一步</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {baseUrl} from './../../../api/env'

  import {add_Cus_DepositOrder,getWxQRCode,getAliQRCode,remitCusOrder} from './../../../api/getData'
  export default {
    components:{

    },
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',

          }
        }
      },
      modalShow:{
        type: Boolean,
        default: false,
      },
      modalFormTitle:{
        type: String,
        default: '充值',
      },
    },
    data() {
      return {
        currentStep:0,
        Sim_Count:10,
        FlowCount:10,
        IsModalShow:false,
        modalForm:{
            Cash:0
        },
        modalForm_loading:false,
        isInputNumber:false, //是否在输入
        WxQRCode:'',//微信支付二维码
        AliQRCode:'',//支付宝二维码
        PayOrderNum:'',
        visible:false,
        tabValue:'name1',
      }
    },
    computed: {
        
    },
    watch:{
      modalShow(curVal,oldVal){
        if(curVal){
          this.IsModalShow=curVal;
        }
      }
    },
    created(){


    },
    mounted(){


    },
    methods: {
      async getOrderWxQRCode(){
        let res = await getWxQRCode(this.modalForm);
        if (res.success){
          this.WxQRCode='data:image/jpeg;base64,'+res.QRCode;

        }
      },
      async GetOrderAliQRCode(name){
        if (name === 'name2'){
          let res = await getAliQRCode(this.modalForm);
          if (res.success){
            this.AliQRCode='data:image/jpeg;base64,'+res.QRCode;
          }
        }
      },

      /*@@上一步*/
      prevStep(){
        this.modalForm_loading=true;
        if (this.currentStep>0){
          this.currentStep--;
        }
        this.modalForm_loading=false;
      },
      nextStep(){
        this.modalForm_loading=true;
        
        if(this.currentStep==0){
          this.submitOrder();
        }
        this.modalForm_loading=false;

      },
 
      cancel() {
        this.$emit('listenModalForm');
      },
      async submitOrder(){
        const params = this.modalForm;
        console.log(params)
        const res = await add_Cus_DepositOrder(params);
        console.log(res);
        if(res.success){
            this.WxQRCode = 'data:image/png;base64, '+re.result.wxQR;
            this.PayOrderNum=re.result.orderNum;
           
            var me =this;
            this.conn = $.connection(baseUrl+"/Signalr/PayConnection");
            this.conn.start().done(function (data) {
              me.conn.send(me.PayOrderNum);
            });

            this.conn.received(function (data) {
              var obj = JSON.parse(data);
              if(obj.success){
                me.Current_Step+=1;
              }
            });
          }else{
            this.$Message.error(res.msg);
          }
      },
    
    }
  }

</script>
