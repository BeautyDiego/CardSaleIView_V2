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
            <Step title="支付订单"></Step>
            <Step title="完成"></Step>
          </Steps>
        </div>
      </Row>
      
      <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 35px 30px 5px">
        <div v-show="currentStep==0">
          <Row>
            <Col span="17">
            <Form-item label="充值金额" prop="BeforeCash" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
              <InputNumber v-model="modalForm.BeforeCash" ></InputNumber>
            </Form-item>
              <Row>
                <Col span="6">
                <Tooltip placement="top">
                  <div slot="content">
                    <table class="fee-scale">
                      <tr>
                       
                        <td>充值金额</td>
                      </tr>
                      <tr v-for="config in Cus_AccountDetailList">
                        <td>{{config.BeforeCash}}</td>
                      </tr>
                    </table>
                  </div>
                </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col span="7">
            <Card :bordered="true" style="background-color: #fafafa">
              <p slot="title">当前配置</p>
              <div class="current-setting">
                <Row class="setting-row"><Col span="12" class="setting-title">原单价：</Col><Col span="12">￥{{modalForm.BeforeCash}} &nbsp元</Col></Row>
                <Row style="font-size:28px;color:#ea6219;">￥{{modalForm.BeforeCash}}</Row>
              </div>
            </Card>
            </Col>
          </Row>
        
        </div>
      </Form>
      <div class="pay-part" v-show="currentStep==2">
        <h2>收银台</h2>
        <Row style="background-color: #f2f2f2;padding:20px;">
          <Col span="6" style="line-height: 36px;">
          <Row>应付金额：￥{{modalForm.BeforeCash}}</Row>
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
          <TabPane label="线下汇款" name="name3">
            <div>
              <Form ref="remitForm" :model="modalForm" :label-width="100"  value=true  style="padding: 15px 30px">
                <Form-item label="开户银行：">
                  <Row>
                    <Col span="12">
                    珠海华润银行股份有限公司敬业支行
                    </Col>
                  </Row>
                </Form-item>
                <Form-item label="收款单位：">
                  <Row>
                    <Col span="12">
                    珠海潮大科技有限公司
                    </Col>
                  </Row>
                </Form-item>
                <Form-item label="银行账号：">
                  <Row>
                    <Col span="12">
                    213220701327300001
                    </Col>
                  </Row>
                </Form-item>
                <Form-item label="汇款证明：" >
                  <Row>
                    <Col span="12">
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
                    </Col>
                  </Row>
                </Form-item>
                <Form-item label="联系人手机：" prop="RemittancePhone" :rules="{required: true, message: '输入11位手机号', trigger:'blur',type:'string',pattern: /^1\d{10}$/}">
                  <Row>
                    <Col span="12">
                    <Input v-model="modalForm.RemittancePhone" ></Input>
                    </Col>
                  </Row>
                </Form-item>
                <Form-item label="备注：" >
                  <Col span="12">
                  <Input v-model="modalForm.Remark" type="textarea" :rows="3"></Input>
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

            <Col span="12" class="text-center">
            订单编号
            </Col>
            <Col span="6" class="text-center">
            金额（元）
            </Col>
          </Row>
          <Row style="border-bottom:1px solid #cccccc;padding-bottom:10px;">
            <Col span="12" class="text-center">
            {{modalForm.OrderNum}}
            </Col>
            <Col span="6" class="text-center">
            <span style="color:#e4393c">￥{{OrderPrice}}</span>
            </Col>
          </Row>
        </div>
      </div>
      <div slot="footer">
        <Button type="ghost"   @click="cancel" >取消</Button>
        <Button type="ghost" :loading="modalForm_loading"  @click="prevStep" v-show="currentStep!=3">上一步</Button>
        <Button type="ghost" :loading="modalForm_loading"  @click="nextStep" v-show="currentStep==0||(currentStep==1&&IsPayStatus)">下一步</Button>
        <!--<Button type="primary" v-show="currentStep==1&&!IsPayStatus" :loading="modalForm_loading" @click="saveForm('modalForm')">提交订单</Button>-->
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
  import {Cus_AccountDetailList,editCusAccountDetail,getWxQRCode,getAliQRCode,remitCusOrder} from './../../../api/getData'
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
            BeforeCash:'',
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
        Cus_AccountDetailList:[],
        isDragging:false, //是否在拖动滑块
        isInputNumber:false, //是否在输入
        WxQRCode:'',//微信支付二维码
        AliQRCode:'',//支付宝二维码
        conn:{}, //signal 连接
        visible:false,
        tabValue:'name1',
      }
    },
    computed: {
      OrderPrice:function () {
        return this.modalForm.SinglePrice*this.modalForm.ValidMonth*this.Sim_Count;
      },
      //节省下来的钱
//      SaveMoney:function () {
//        return (this.modalForm.OriginSinglePrice-this.modalForm.SinglePrice)*this.modalForm.ValidMonth*this.Sim_Count;
//      },
//      ConfigListLength:function () {
//        return this.Cus_AccountDetailList.length;
//      },
//      //是否是待付款状态
//      IsPayStatus:function () {
//        return this.modalForm.OrderStatus===1;
//      },
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
          this.tabValue='name1' //默认进入微信支付tab
          this.modalForm=Object.assign(this.parentForm);

          this.Sim_Count=1;

          this.$nextTick(() => this.$refs.simSlider.refresh())
          this.IsModalShow = curVal;
          this.currentStep=0;
          if (this.modalFormTitle==='充值'){



          }

          //如果状态是支付
          if (this.IsPayStatus){
            this.currentStep=2;
            this.Sim_Count= this.modalForm.Sim_Count;
            //this.FlowCount= this.modalForm.FlowCount;
            this.getOrderWxQRCode();

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
            console.log(this.conn)
            this.conn.stop();
            //  console.log("conn stop")
          }
        }
      },
    },
    created(){
  //      this.getCusAccountDetailList();

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
      /*
      @获取sim卡花费配置
      * **/
//      async getSimExpanseConfigList(){
//        this.simExpanseConfigList= await simExpanseConfigList();
//        this.modalForm.SinglePrice=this.simExpanseConfigList[0].SinglePrice
//        this.modalForm.ChargePrice=this.simExpanseConfigList[0].ChargePrice
//
//      },
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
            params.FlowCount=parseInt(this.modalForm.FlowCount)*1024*1024;
            params.OrderPrice=this.OrderPrice;
            try{
              let result;
              if (this.modalFormTitle ==='余额充值'){
                result = await addCusOrder(params);
              }else{
                result = await editCusAccountDetail(params);
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
