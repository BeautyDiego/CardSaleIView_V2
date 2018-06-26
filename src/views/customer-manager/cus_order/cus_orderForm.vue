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

.current-setting{font-size: 12px;}

.current-setting .setting-row{
  line-height: 26px;
}
.current-setting .setting-title{
  color:#bbbbbb;
}





.upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.upload-list img{
  width: 100%;
  height: 100%;
}
.upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.upload-list:hover .upload-list-cover{
  display: block;
}
.upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
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
          <Step title="收货信息"></Step>
          <Step title="支付订单"></Step>
          <Step title="完成"></Step>
        </Steps>
      </div>
    </Row>

    <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 35px 30px 5px">
      <div v-show="currentStep==0">
        <Row>
          <Col span="17">
            <Form-item label="SIM卡类型：" >
              <Row>
                <RadioGroup v-model="modalForm.Sim_Type"  type="button" size="large">
                  <Radio v-for="item in SimTypeList" :label="item.value" :key="item.value" :disabled="IsPayStatus" >  <span>{{ item.label }}</span></Radio>
                </RadioGroup>
              </Row>
            </Form-item>
            <Form-item label="套餐有效时长：" >
              <Row>
                <Select v-model="modalForm.ValidMonth" :disabled="IsPayStatus" style="width:200px;">
                  <Option v-for="item in ValidMonthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </Row>
            </Form-item>
            <Form-item label="使用场景：" >
              <Row>
                <Input v-model="modalForm.UseCase" :readonly="IsPayStatus" style="width: 200px"></Input>
              </Row>
            </Form-item>
            <Form-item label="SIM卡数量：" >
              <Row>
                <Col span="18">
                <vueSlider ref="simSlider" v-model="Sim_Count" :disabled="IsPayStatus" :clickable="false" tooltip="hover" @drag-start="ondragstart" @drag-end="onSIMdrageend" :min="Sim_CountMin" :max="Sim_CountMax"></vueSlider>
                </Col>
                <Col span="6">
                <InputNumber v-model="Sim_Count" :precision=0   @on-blur="onSIMblur" @on-focus="onfocus" @on-change="onSIMChange" :readonly="IsPayStatus"></InputNumber>&nbsp个
                </Col>
              </Row>
            </Form-item>
            <Form-item label="总流量："  >
              <Row>
                <Col span="18">
                <vueSlider ref="flowSlider" v-model="FlowCount" :disabled="IsPayStatus" :clickable="false" tooltip="hover" @drag-start="ondragstart" @drag-end="onFlowdrageend"  :min="Flow_CountMin" :max="Flow_CountMax"></vueSlider>
                </Col>
                <Col span="6">
                <InputNumber v-model="FlowCount" :precision=0 @on-blur="onFlowblur" @on-focus="onfocus" @on-change="onFlowChange"  :readonly="IsPayStatus"></InputNumber>&nbspGB
                </Col>
              </Row>
            </Form-item>
            <Form-item label="购买单价："  >
              ￥{{modalForm.SinglePrice.toFixed(2)}} &nbsp/GB
            </Form-item>
            <Form-item label="订单金额："  >
              <Row>
                <Col span="18">
                ￥{{OrderPrice.toFixed(2)}}
                </Col>
              </Row>
            </Form-item>
          </Col>
          <Col span="7">
            <Card :bordered="true" style="background-color: #fafafa">
              <p slot="title">当前配置</p>
              <div class="current-setting">
                  <Row class="setting-row"><Col span="12" class="setting-title">运营商：</Col><Col span="12">中国电信</Col> </Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">SIM卡类型：</Col><Col span="12">{{SIMTypeTxt}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">套餐有效时长：</Col><Col span="12">{{ValidMonthTxt}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">使用场景：</Col><Col span="12">{{modalForm.UseCase}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">购买数量：</Col><Col span="12">{{Sim_Count}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">流量数量：</Col><Col span="12">{{FlowCount}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">原单价：</Col><Col span="12">￥{{OriginalSinglePrice}} &nbsp/GB</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">活动单价：</Col><Col span="12">￥{{modalForm.SinglePrice.toFixed(2)}} &nbsp/GB</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">订单金额：</Col><Col span="12"></Col></Row>
                  <Row style="font-size:28px;color:#ea6219;">￥{{OrderPrice.toFixed(2)}}</Row>
                  <Row style="font-size:18px;color:#47b348;">省￥{{SaveMoney.toFixed(2)}}</Row>
              </div>
            </Card>
          </Col>
        </Row>
     
       
       
      </div>
      <div v-show="currentStep==1" style="padding-right:70px;">
        <Form-item label="收货人：" prop="ReceiveName" :rules="{required: true, message: '必填,1-10位字符',min:1,max:10, trigger:'blur',type:'string'}" >
          <Input v-model="modalForm.ReceiveName"  :readonly="IsPayStatus"></Input>
        </Form-item>
        <Form-item label="收货电话：" prop="ReceiveMobile" :rules="{required: true, message: '输入11位手机号', trigger:'blur',type:'string',pattern: /^1\d{10}$/}" >
          <Input v-model="modalForm.ReceiveMobile" :readonly="IsPayStatus" ></Input>
        </Form-item>
        <Form-item label="收货地址：" prop="ReceiveAddress" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
          <Input v-model="modalForm.ReceiveAddress" :readonly="IsPayStatus" ></Input>
        </Form-item>
      </div>
    </Form>
    <div class="pay-part" v-show="currentStep==2">
      <h2>收银台</h2>
      <Row style="background-color: #f2f2f2;padding:20px;">
        <Col span="18">
          <Row>订单编号：{{modalForm.OrderNum}}</Row>
          <Row>订单类型：{{modalForm.SingleOrPoolText}}购买</Row>
        </Col>
        <Col span="6" style="line-height: 36px;">
          <Row>应付金额：￥{{modalForm.OrderPrice.toFixed(2)}}</Row>
        </Col>
      </Row>
      <Tabs v-model="tabValue"  @on-click="GetOrderAliQRCode">
       <TabPane label="余额支付" name="name0">
           <div>
             余额支付
             <div style="width:100%; text-align: center;">
               <div>
               <Row>
                <Col span="12">
                   当前余额：{{this.RestCash}} 元
                </Col>
                 <Col span="12">
                   <Button type="primary">充值</Button>
                </Col>
               </Row>
                 <Row>
                <Col span="18">
                   <Button type="success" @click="restPayOrder()">立即支付</Button>
                </Col>
               </Row>
               </div>

             </div>
           </div>
        </TabPane>
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
        <TabPane label="线下汇款" name="name3">
          <div>
            <Form ref="remitForm" :model="modalForm" :label-width="100"  value=true  style="padding: 15px 30px">
              
                <Row>
                  <Col span="12">
                  <Form-item label="开户银行：">
                  珠海华润银行股份有限公司敬业支行
                  </Form-item>               
                  </Col>
                </Row>
          
                <Row>
                <Col span="12">
                <Form-item label="收款单位：">
                  珠海潮大科技有限公司
                  </Form-item>
                  </Col>
                  <Col span="12">
                   <Form-item label="银行账号：">
                      213220701327300001
                     </Form-item>
                  </Col>
                </Row>
                         
              <Row>
                <Col span="12">
                 <Form-item label="汇款证明：" >
                  <div class="upload-list" v-if="modalForm.RemittanceUrl">
                    <template >
                      <img :src="modalForm.RemittanceUrl">
                      <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                      </div>
                    </template>
                  </div>
                  <Upload v-else
                          ref="upload"
                          :headers="MyHeaders"
                          :show-upload-list="false"
                          :on-success="handleSuccess"
                          :format="['jpg','jpeg','png']"
                          :max-size="2048"
                          :on-format-error="handleFormatError"
                          :on-exceeded-size="handleMaxSize"
                          multiple
                          type="drag"
                          :action="UploadAddress"
                          style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                      <Icon type="camera" size="20"></Icon>
                    </div>
                  </Upload>
                  </Form-item>
                </Col>
                <Col span="9">
                  <Form-item label="联系人手机：" prop="RemittancePhone" :rules="{required: true, message: '输入11位手机号', trigger:'blur',type:'string',pattern: /^1\d{10}$/}">
                    <Input v-model="modalForm.RemittancePhone" ></Input>                                
                  </Form-item>
                </Col>
              </Row>
            
             
              <Form-item label="备注：" >
                  <Col span="21">
                    <Input v-model="modalForm.Remark" type="textarea" :rows="2"></Input>
                  </Col>
                </Row>
              </Form-item>
            </Form>
           
          </div>
        </TabPane>
      </Tabs>
    </div>
    <!--充值成功-->
    <div class="pay-success" v-if="currentStep==3">
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
          <Col span="6" class="text-center">
          产品名称
          </Col>
          <Col span="12" class="text-center">
          订单编号
          </Col>
          <Col span="6" class="text-center">
          金额（元）
          </Col>
        </Row>
        <Row style="border-bottom:1px solid #cccccc;padding-bottom:10px;">
          <Col span="6" class="text-center">
          流量池购买
          </Col>
          <Col span="12" class="text-center">
          {{modalForm.OrderNum}}
          </Col>
          <Col span="6" class="text-center">
          <span style="color:#e4393c">￥{{OrderPrice.toFixed(2)}}</span>
          </Col>
        </Row>
      </div>
    </div>
    <div slot="footer">
      <Button type="ghost"   @click="cancel" >取消</Button>
      <Button type="ghost" :loading="modalForm_loading"  @click="prevStep" v-show="currentStep!=3&&currentStep!=2">上一步</Button>
      <Button type="ghost" :loading="modalForm_loading"  @click="nextStep" v-show="currentStep==0||(currentStep==1&&IsPayStatus)">下一步</Button>
      <Button type="primary" v-show="currentStep==1&&!IsPayStatus" :loading="modalForm_loading" @click="saveForm('modalForm')">提交订单</Button>
      <Button type="primary"  v-show="currentStep==2&&tabValue=='name3'" :loading="modalForm_loading" @click="saveRemit('remitForm')">提交</Button>
    </div>
  </Modal>
  <Modal title="汇款单凭证" v-model="visible">
    <img :src="modalForm.RemittanceUrl" v-if="visible" style="width: 100%">
    <div slot="footer">
    </div>
  </Modal>
</div>

</template>

<script>
import {baseUrl} from './../../../api/env'
import vueSlider from 'vue-slider-component'
import {simExpanseConfigList,addCusOrder,editCusOrder,getWxQRCode,getAliQRCode,remitCusOrder,getCusRestCash,payOrderbyRestCash} from './../../../api/getData'
export default {
    components:{
      vueSlider,
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
            RemittanceUrl:'',
            RemittancePhone:'',
            Sim_Type:1,
            ValidMonth:'',
            UseCase:'',
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '添加订单',
      },
    },
    data() {
        return {
          currentStep:0,
          Sim_Count:10,
          FlowCount:10,
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
            RemittanceUrl:'',
            RemittancePhone:'',
            Sim_Type:1,
            ValidMonth:'',
            UseCase:'',
          },
          modalForm_loading:false,
          simExpanseConfigList:[],
          isDragging:false, //是否在拖动滑块
          isInputNumber:false, //是否在输入
          WxQRCode:'',//微信支付二维码
          AliQRCode:'',//支付宝二维码
          conn:{}, //signal 连接
          visible:false,
          tabValue:'name0',
          ValidMonthList:[{value:1,label:'一个月'},{value:2,label:'二个月'},{value:3,label:'三个月'},{value:6,label:'半年'},{value:12,label:'一年'},{value:24,label:'二年'},{value:36,label:'三年'},],
          SimTypeList:[{value:1,label:'普通'},{value:2,label:'micro-SIM'},{value:3,label:'nano-SIM'},{value:4,label:'安全SIM卡'},],
          OriginalSinglePrice:50, //原单价
          RestCash:0
        }
    },
    computed: {
      Sim_CountMin: function () {
        if (this.simExpanseConfigList.length>0){
          return this.simExpanseConfigList[0].MinSimCount;
        }else{
          return 0;
        }
        
      },
      Sim_CountMax: function () {
        if (this.simExpanseConfigList.length>0){
          return this.simExpanseConfigList[this.simExpanseConfigList.length-1].MaxSimCount;
        }else{
          return 1000;
        }
      },
      Flow_CountMin: function () {
        if (this.simExpanseConfigList.length>0){
          return this.simExpanseConfigList[0].MinFlowCount;
        }else{
          return 0;
        }

      },
      Flow_CountMax: function () {
        if (this.simExpanseConfigList.length>0){
          return this.simExpanseConfigList[this.simExpanseConfigList.length-1].MaxFlowCount;
        }else{
          return 1000;
        }
      },
      OrderPrice:function () {
        return this.modalForm.SinglePrice*this.FlowCount*this.modalForm.ValidMonth;
      },
      //节省下来的钱
      SaveMoney:function () {
        return  (this.OriginalSinglePrice-this.modalForm.SinglePrice)*this.FlowCount*this.modalForm.ValidMonth;
      },
      ConfigListLength:function () {
        return this.simExpanseConfigList.length;
      },
      //是否是待付款状态
      IsPayStatus:function () {
        return this.modalForm.OrderStatus===1;
      },
      //汇款单上传地址
      UploadAddress:function () {
        return baseUrl+'/Cus_Order/UploadFile';
      },
      MyHeaders:function () {
        let myHeaders = {};
        let tokenValue = sessionStorage.getItem("token");
        if (tokenValue){
          myHeaders.Authorization=tokenValue;
        }
        return myHeaders;
      },
      SIMTypeTxt:function () {
        let simType=this.modalForm.Sim_Type;
        return this.SimTypeList.find((s)=>s.value===simType).label;
      },
      ValidMonthTxt:function () {
        let ValidMonth=this.modalForm.ValidMonth;
        if (ValidMonth){
          return this.ValidMonthList.find((s)=>s.value===ValidMonth).label;
        }else{
          return "";
        }
        
      }
    },
    watch:{
      modalShow(curVal,oldVal){
        if (curVal){
          this.tabValue='name0' //默认进入微信支付tab
          this.modalForm=Object.assign(this.parentForm);

          this.Sim_Count=10;
          this.FlowCount=10;
          this.$nextTick(() => this.$refs.simSlider.refresh())
          this.$nextTick(() => this.$refs.flowSlider.refresh())
          this.IsModalShow = curVal;
          this.currentStep=0;
          if (this.modalFormTitle==='添加订单'){
            this.modalForm.SinglePrice=this.simExpanseConfigList[0].SinglePrice
            this.modalForm.ChargePrice=this.simExpanseConfigList[0].ChargePrice
            this.OriginalSinglePrice=this.simExpanseConfigList[0].OriginalPrice
            this.Sim_Count=this.simExpanseConfigList[0].MinSimCount;
            this.FlowCount=this.simExpanseConfigList[0].MinFlowCount;
          }
        
          //如果状态是支付
          if (this.IsPayStatus){
            this.currentStep=2;
            this.Sim_Count= this.modalForm.Sim_Count;
            this.FlowCount= this.modalForm.FlowCount;
            this.GetOrderRestCash();

            var me =this;
            this.conn = $.connection(baseUrl+"/Signalr/PayConnection");
            console.log(baseUrl+"/Signalr/PayConnection");
            this.conn.start().done(function (data) {
            //  console.log("连接成功，connectionId 为： " + data.id + "\r\n");
              me.conn.send(me.modalForm.OrderNum);
             // console.log("send:"+me.modalForm.OrderNum)
            });

            this.conn.received(function (data) {
              var obj = JSON.parse(data);
              if(obj.success){
                me.currentStep=3;
                me.$emit('refreshTableList');
              }
             // console.log("收到数据： " + data + "\r\n");

            });
          }
        }else{
          this.IsModalShow=curVal;
            if(this.conn!=null&&this.conn!=''){
              this.conn.stop();
            //  console.log("conn stop")
            }
        }
      },
    },
    created(){
       this.getSimExpanseConfigList();
 
    },
    mounted(){

    
    },
    methods: {
      async getOrderWxQRCode(name){
        if (name === 'name1'){
        let res = await getWxQRCode(this.modalForm);
        if (res.success){
          this.WxQRCode='data:image/jpeg;base64,'+res.QRCode;
        }
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
       async GetOrderRestCash(){
          let res = await getCusRestCash(this.modalForm);
          if (res.success){
            this.RestCash = res.result.toFixed(2);
          }        
      },
      /*
      @获取sim卡花费配置
      * **/
      async getSimExpanseConfigList(){
          this.simExpanseConfigList= await simExpanseConfigList();
          this.modalForm.SinglePrice=this.simExpanseConfigList[0].SinglePrice
          this.modalForm.ChargePrice=this.simExpanseConfigList[0].ChargePrice
         
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
        this.currentStep++;
        this.modalForm_loading=false;
      },
      ondragstart(){
         this.isDragging=true;
      },
      onSIMdrageend(){
         this.isDragging=false;
      },
      onFlowdrageend(){

      },
      onfocus(){
         this.isInputNumber=true;
      },
      onSIMblur(){
        this.isInputNumber=false;   
      },
      onSIMChange(){
    
      },
      onFlowblur(){
        this.isInputNumber=false;
      },
      onFlowChange(){

      },
      cancel() {
          this.$emit('listenModalForm');
      },
      async restPayOrder() {
        let res = await payOrderbyRestCash(this.modalForm);
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
                    desc: '余额支付失败，请联系管理员或更换支付方式。 '
                });
          }
         
      },
      /*
      * @@提交订单
      * */
      saveForm(name) {
        this.$refs[name].validate( async (valid) => {
          if (valid) {
            this.modalForm_loading=true;
            const params = this.modalForm;
            params.Sim_Count=this.Sim_Count;
            params.FlowCount=parseInt(this.FlowCount)*1024*1024;
            params.OrderPrice=this.OrderPrice;
            try{
              let result;
              if (this.modalFormTitle ==='添加订单'){
                 result = await addCusOrder(params);
              }else{
                 result = await editCusOrder(params);
              }
              if (result.success) {
                this.$Message.success('提交成功!');
                this.modalForm.OrderNum=result.OrderNum;
                this.modalForm.OrderStatus=1;
                this.WxQRCode='data:image/jpeg;base64,'+result.QRCode;
               // this.$emit('listenModalForm');
                this.currentStep++;
                this.$emit('refreshTableList');

                var me =this;
                this.conn = $.connection(baseUrl+"/Signalr/PayConnection");
              //  console.log(baseUrl+"/Signalr/PayConnection");
                this.conn.start().done(function (data) {
               //   console.log("连接成功，connectionId 为： " + data.id + "\r\n");
                  me.conn.send(result.OrderNum);
                //  console.log("send:"+result.OrderNum)
                });

                this.conn.received(function (data) {
                  var obj = JSON.parse(data);
                  if(obj.success){
                    me.currentStep=3;
                    me.$emit('refreshTableList');
                  }
               //   console.log("收到数据： " + data + "\r\n");

                });
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
      //提交汇款信息
      saveRemit(name){
        this.$refs[name].validate( async (valid) => {
          if (valid) {
            if (!this.modalForm.RemittanceUrl){
              this.$Message.error('请上传汇款证明');
              return;
            }
            this.modalForm_loading=true;
            const params = this.modalForm;
            try{
              let result;
              result = await remitCusOrder(params);
              if (result.success) {
                this.currentStep=3;
                this.$Message.success('提交成功!');
                this.$emit('refreshTableList');
              }else{
                this.$Message.error(result.msg);
              }
            } catch(err) {
              console.log(err);
              this.$Message.error('服务器异常，稍后再试');
            }
            this.modalForm_loading=false;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove (file) {
        this.modalForm.RemittanceUrl='';
      },
      handleSuccess (res, file) {
        this.modalForm.RemittanceUrl=res.Url;
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不对',
          desc: '上传文件格式不正确，请上传jpg或png格式的图片'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '文件太大',
          desc: '图片太大，请压缩至小于2M.'
        });
      },
    }
}

</script>
