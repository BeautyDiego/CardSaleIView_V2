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
    :closable="false"
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
          <Col span="15">

             <Form-item label="购买种类："  >
               {{modalForm.CardType}}
            </Form-item>
            <Form-item label="SIM卡类型：" >
              <Row>
                <RadioGroup v-model="modalForm.Sim_Type"  type="button" size="large">
                  <Radio v-for="item in SimTypeList" :label="item.value" :key="item.value" >  <span>{{ item.label }}</span></Radio>
                </RadioGroup>
              </Row>
            </Form-item>
            <Form-item label="套餐有效时长：" >
              <Row>
                <Select v-model="modalForm.ValidMonth" :disabled="modalForm.ValidMonth!=1"  style="width:200px;">
                  <Option v-for="item in ValidMonthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </Row>
            </Form-item>
            <Form-item label="使用场景：" >
              <Row>
                <Input v-model="modalForm.UseCase"  style="width: 200px"></Input>
              </Row>
            </Form-item>
            <Form-item label="SIM卡数量：" >
              <Row>
                <Col span="18">
                <vueSlider ref="simSlider" v-model="Sim_Count"  :clickable="false" tooltip="hover" @drag-start="ondragstart" @drag-end="onSIMdrageend" :min="1" :max="5000"></vueSlider>
                </Col>
                <Col span="6">
                <InputNumber v-model="Sim_Count" :precision=0   @on-blur="onSIMblur" @on-focus="onfocus" @on-change="onSIMChange" ></InputNumber>&nbsp个
                </Col>
              </Row>
            </Form-item>
            <Form-item label="总流量："  >
               {{modalForm.FlowCount.toFixed(2)}} &nbsp {{modalForm.FlowCountUint}}
            </Form-item>
            <Form-item label="购买单价："  >
              ￥{{modalForm.SinglePrice.toFixed(2)}} 
            </Form-item>
            <Form-item label="订单金额："  >
              <Row>
                <Col span="18">
                ￥{{OrderPrice.toFixed(2)}}
                </Col>
              </Row>
            </Form-item>
          </Col>
          <Col span="9">
            <Card :bordered="true" style="background-color: #fafafa">
              <p slot="title">当前配置</p>
              <div class="current-setting">
                  <Row class="setting-row"><Col span="12" class="setting-title">运营商：</Col><Col span="12">{{modalForm.OperType}}</Col> </Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">购买种类：</Col><Col span="12">{{modalForm.CardType}}</Col> </Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">SIM卡类型：</Col><Col span="12">{{SIMTypeTxt}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">套餐有效时长：</Col><Col span="12">{{ValidMonthTxt}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">使用场景：</Col><Col span="12">{{modalForm.UseCase}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">购买数量：</Col><Col span="12">{{Sim_Count}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">流量数量：</Col><Col span="12">{{modalForm.FlowCount}}&nbsp{{modalForm.FlowCountUint}}</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">原单价：</Col><Col span="12">￥{{modalForm.OriginSinglePrice}} &nbsp元</Col></Row>
                  <Row class="setting-row"><Col span="12" class="setting-title">活动单价：</Col><Col span="12">￥{{modalForm.SinglePrice.toFixed(2)}} &nbsp元</Col></Row>
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
          <Input v-model="modalForm.ReceiveName"  ></Input>
        </Form-item>
        <Form-item label="收货电话：" prop="ReceiveMobile" :rules="{required: true, message: '输入11位手机号', trigger:'blur',type:'string',pattern: /^1\d{10}$/}" >
          <Input v-model="modalForm.ReceiveMobile"  ></Input>
        </Form-item>
        <Form-item label="收货地址：" prop="ReceiveAddress" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
          <Input v-model="modalForm.ReceiveAddress"  ></Input>
        </Form-item>
      </div>
    </Form>
    <div class="pay-part" v-show="currentStep==2">
      <h2>收银台</h2>
      <Row style="background-color: #f2f2f2;padding:20px;">
        <Col span="18">
          <Row>订单编号：{{modalForm.OrderNum}}</Row>
          <Row>资费类型：{{modalForm.ExpName}}</Row>
        </Col>
        <Col span="6" style="line-height: 36px;">
          <Row>应付金额：￥{{OrderPrice.toFixed(2)}}</Row>
        </Col>
      </Row>
      <Tabs v-model="tabValue"  @on-click="GetOrderPayInfo">
        <TabPane label="余额支付" name="name0">

             <div style="width:100%; text-align: center;line-height:300px;">

                   当前余额：{{RestCash}} 元&nbsp&nbsp&nbsp

                   <Button type="success" :loading="modalForm_loading" @click="restPayOrder()">立即支付</Button>

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
                    <Input v-model="modalForm.Remark" type="textarea" :rows="2" :maxlength="100"></Input>
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
          <Col span="3" class="text-center">
          SIM数量
          </Col>
          <Col span="3" class="text-center">
          金额（元）
          </Col>
        </Row>
        <Row style="border-bottom:1px solid #cccccc;padding-bottom:10px;">
          <Col span="6" class="text-center">
           {{modalForm.ExpName}}
          </Col>
          <Col span="12" class="text-center">
          {{modalForm.OrderNum}}
          </Col>
          <Col span="3" class="text-center">
          {{this.Sim_Count}}
          </Col>
          <Col span="3" class="text-center">
          <span style="color:#e4393c">￥{{OrderPrice.toFixed(2)}}</span>
          </Col>
        </Row>
      </div>
    </div>
    <div slot="footer">
      <Button type="ghost"   @click="cancel" >关闭</Button>
      <Button type="ghost" :loading="modalForm_loading"  @click="prevStep" v-show="currentStep==1">上一步</Button>
      <Button type="ghost" :loading="modalForm_loading"  @click="nextStep" v-show="currentStep==0">下一步</Button>
      <Button type="primary" v-show="currentStep==1" :loading="modalForm_loading" @click="saveForm('modalForm')">提交订单</Button>
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
            FlowType:'',
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
        }
    },
    computed: {
      OrderPrice:function () {
        if(this.modalForm.CardType=='单卡')
        {
          if(this.parentForm.FlowType=='月包')
          {
            return this.modalForm.SinglePrice*this.modalForm.ValidMonth*this.Sim_Count;            
          }else
          {
            return this.modalForm.SinglePrice*this.Sim_Count;
          }
        }else
           return this.modalForm.SinglePrice; //流量池与时间和卡的张数无关
      },
      //节省下来的钱
      SaveMoney:function () {
        if(this.modalForm.CardType=='单卡')
          return (this.modalForm.OriginSinglePrice-this.modalForm.SinglePrice)*this.modalForm.ValidMonth*this.Sim_Count;
        else
           return (this.modalForm.OriginSinglePrice-this.modalForm.SinglePrice);
      },
      ConfigListLength:function () {
        return this.simExpanseConfigList.length;
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
          this.tabValue='name0' //默认进入余额支付tab
          this.GetOrderRestCash();
          this.modalForm=Object.assign(this.parentForm);
          console.log(this.parentForm)
          this.Sim_Count=1;

          this.$nextTick(() => this.$refs.simSlider.refresh())
          this.IsModalShow = curVal;
          this.currentStep=0;
        } 
      }
    },
    created(){
     
 
    },
    mounted(){

    
    },
    methods: {
       async GetOrderPayInfo(name){
         console.log(name)
        if (name === 'name1'){
             if (!this.WxQRCode){
                 let res = await getWxQRCode(this.modalForm);
                 if (res.success){
                     this.WxQRCode='data:image/jpeg;base64,'+res.QRCode;
                 }
             }

        }else if (name === 'name2'){
            if (!this.AliQRCode){
                let res = await getAliQRCode(this.modalForm);
                if (res.success){
                    this.AliQRCode='data:image/jpeg;base64,'+res.QRCode;
                }
            }

        }else if(name=='name0'){
          this.GetOrderRestCash();
        }

                  
      },
      async GetOrderRestCash(){
          let res = await getCusRestCash(this.modalForm);
          if (res.success){
            this.RestCash = res.result.toFixed(2);
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
        this.currentStep++;
        this.modalForm_loading=false;
      },
      ondragstart(){
         this.isDragging=true;
      },
      onSIMdrageend(){
        console.log(this.Sim_Count)

      },

      onSIMblur(){
        this.isInputNumber=false;
              console.log(this.Sim_Count);
      },
      onSIMChange(){
        console.log(this.Sim_Count);
      },
      cancel() {
          if(this.currentStep==2){
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>订单尚未支付，您确定关闭吗？</p><p>您也可以到订单管理里去支付该订单。</p>',
                    onOk: () => {
                        this.IsModalShow=false;
                    },
                    onCancel: () => {
                    }
                });
          }else
          {
            this.IsModalShow=false;
          }
        
          this.$emit('listenModalForm');
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
            params.Res_ExpensesName=this.modalForm.ExpName;
            if(this.modalForm.FlowCountUint=="GB"){
              params.FlowCount=parseInt(this.modalForm.FlowCount)*1024*1024;
            }else{
              params.FlowCount=parseInt(this.modalForm.FlowCount)*1024;
            }
            
            params.OrderPrice=this.OrderPrice.toFixed(2);
            try{
              let result;
              if (this.modalFormTitle ==='套餐订购'){
                 result = await addCusOrder(params);
              }else{
                 //result = await editCusOrder(params);
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
      //余额支付订单
      async restPayOrder(){
          this.modalForm_loading=true;
          if (parseFloat(this.RestCash)<parseFloat(this.OrderPrice.toFixed(2))){
              this.$Notice.error({
                  title: '支付失败',
                  desc: '余额不足，请到充值管理页面充值余额 '
              });

          }else{
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
              this.modalForm_loading=false;
          }
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
