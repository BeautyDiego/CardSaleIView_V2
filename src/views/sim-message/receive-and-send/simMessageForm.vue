<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="700">
    <Form ref="modalForm" :model="modalForm" :label-width="80"  value=true  style="padding: 3px 60px">
      <Form-item label="短信内容" prop="MsgContent" :rules="{required: true, message: '必填,1-60位字符',min:1,max:60, trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.MsgContent" type="textarea" max="50" :rows="4" placeholder="请输入短信内容"></Input>
        还可输入<span style="color:red">{{50-modalForm.MsgContent.length}}</span>字
      </Form-item>
      <Form-item label="选择卡"  >
        <Button type="primary" size="large" icon="ios-cloud-upload-outline" @click="chooseSimCard">选择SIM卡</Button>
      </Form-item>
      <Form-item label="卡号"  prop="ReceiveNum" :rules="{required: true, message: '请选择SIM卡',min:1,max:60, trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.ReceiveNum" :readonly="true" type="textarea" :rows="4" placeholder="请选择sim卡号"></Input>
      </Form-item>
    </Form>
    <div slot="footer">
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">发送</Button>
    </div>
  </Modal>
    <simTransfer :modalShow="IsTransferShow"
                 @listenModalForm="hideTransferModel"
                 @emiteSimNums = "getTransferSimNums"></simTransfer>
</div>

</template>

<script>
import {addSimMessage} from './../../../api/getData'
import simTransfer from './simTransfer.vue'
export default {
    components:{
        simTransfer
    },
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            Cus_CustomerId: '',
            SendType: '',
            SendNum:'',
            ReceiveNum:'',
            MsgContent:'',
            SendTime:'',
            SendStatus:'',
            ReceiveStatus:'',
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '新建短信',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
              Id:'',
              Cus_CustomerId: '',
              SendType: '',
              SendNum:'',
              ReceiveNum:'',
              MsgContent:'',
              SendTime:'',
              SendStatus:'',
              ReceiveStatus:'',
          },
          modalForm_loading:false,
          IsTransferShow:false,
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
      }
    },
    created(){
    },
    mounted(){
    
    },
    methods: {
      cancel() {
          this.$emit('listenModalForm');
      },
      saveForm(name) {
        this.$refs[name].validate( async (valid) => {
          if (valid) {
            this.modalForm_loading=true;
            const params = this.modalForm;
            try{
              let result;
              if (this.modalFormTitle ==='新建短信') {
                  result = await addSimMessage(params);
              }
              if (result.success) {
                this.$Message.success('提交成功!');
                this.$emit('listenModalForm');
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
      chooseSimCard(){
          this.IsTransferShow=true;
      },
      hideTransferModel(){
          this.IsTransferShow = false;
      },
      getTransferSimNums(simArr){
          this.modalForm.ReceiveNum = simArr.join(',')
      },
    }
}

</script>
