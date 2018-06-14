<style scoped>
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
    :title="modalFormTitle"
    @on-cancel="cancel"
    :mask-closable="false"
    width="600">
    <Row>
      <div style="padding-left:105px;padding-bottom:10px;">
        <Steps :current="Current_Step">
          <Step title="支付" content="选择支付方式"></Step>
          <Step title="完成" content="查看支付结果"></Step>
        </Steps>
      </div>
    </Row>
    <div class="pay-part" v-if="Current_Step==0">
      <h2>收银台</h2>
      <Row style="background-color: #f2f2f2;padding:20px;">
        <Col span="18">
        <Row>订单编号：{{modalForm.ReChargeOrderNum}}</Row>
        <Row>订单类型：流量池充值</Row>
        </Col>
        <Col span="6" style="line-height: 36px;">
        <Row>应付金额：￥{{modalForm.ChargeFee}}</Row>
        </Col>
      </Row>
      <Tabs v-model="tabValue" @on-click="getAliQRCode">
        <TabPane label="微信支付" name="name1">
          <div>
            <img src="./../../../images/WePayLogo.png" class="wepay-logo" alt="">
            <div style="width:100%; text-align: center;">
              <div>
                <img :src="WeChatQR"  >
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
                <img :src="AliQRCode"  >
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
    <div class="pay-success" v-if="Current_Step==1">
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
          流量池充值
          </Col>
          <Col span="12" class="text-center">
          {{modalForm.ReChargeOrderNum}}
          </Col>
          <Col span="6" class="text-center">
          <span style="color:#e4393c">￥{{modalForm.ChargeFee}}</span>
          </Col>
        </Row>
      </div>
    </div>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
      <Button type="primary"  v-show="Current_Step==0&&tabValue=='name3'" :loading="modalForm_loading" @click="saveRemit('remitForm')">提交</Button>
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
import {getReChargeWeChatQRCode,getReChargeAliQRCode,remitChargeOrder} from './../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            ReChargeOrderNum: '',
            ChargeFee:0,
            ChargeFlowCount: 0,
            ChargeStatus: 0,
            RemittanceUrl:'',
            RemittancePhone:'',
            Remark:''
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '添加用户',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
            Id:'',
            ReChargeOrderNum: '',
            ChargeFee:0,
            ChargeFlowCount: 0,
            ChargeStatus: 0,
            RemittanceUrl:'',
            RemittancePhone:'',
            Remark:''
          },
          modalForm_loading:false,
          WeChatQR:'', //微信二维码
          AliQRCode:'', //支付宝二维码
          Current_Step:0,
          tabValue:'name1',
          visible:false,
        }
    },
    computed:{
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
      }
    },
    watch:{
      modalShow(curVal,oldVal){
        
        this.IsModalShow = curVal;
       
        if (curVal){
          this.tabValue='name1'
          this.Current_Step=0;
          this.modalForm=Object.assign(this.parentForm);
          this.getReChargeWxQRCode();
          var me =this;
          this.conn = $.connection(baseUrl+"/Signalr/PayConnection");
         // console.log(baseUrl+"/Signalr/PayConnection");
          this.conn.start().done(function (data) {
          //  console.log("连接成功，connectionId 为： " + data.id + "\r\n");
            me.conn.send(me.modalForm.ReChargeOrderNum);
          //  console.log("send:"+me.modalForm.ReChargeOrderNum);
          });

          this.conn.received(function (data) {
            var obj = JSON.parse(data);
            if(obj.success){
              me.Current_Step+=1;
              me.$emit('refreshTableList');
            }
          //  console.log("收到数据： " + data + "\r\n");

          });
        }else
        {
          if(this.conn!=null&&this.conn!=''){
            this.conn.stop();
         //   console.log("conn stop")
          }
        }
      }
    },
    created(){

    },
    mounted(){
    
    },
    methods: {
      async getReChargeWxQRCode(){
        let res= await getReChargeWeChatQRCode(this.modalForm);
        this.WeChatQR='data:image/png;base64, '+res.QRCode;
      },
      async getAliQRCode(name){
        if (!this.AliQRCode&&name === 'name2'){
          let res= await getReChargeAliQRCode(this.modalForm);
          if (res.success){
            this.AliQRCode='data:image/png;base64, '+res.QRCode;
          }
        }
      },
      cancel() {
          this.$emit('listenModalForm');
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
              result = await remitChargeOrder(params);
              if (result.success) {
                this.Current_Step=1;
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
