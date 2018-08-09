<style scoped>

</style>

<template>

<div>
  <Modal
    v-model="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="800">
    <Form ref="modalForm" :model="modalForm" :label-width="120"   style="padding: 3px 60px">
      <Row style="padding-left:30px;">
        <div style="margin-left:-30px;padding:10px 0 25px;">定义任务名称和类型</div>
        <Form-item label="任务名称" prop="TaskName" :rules="{required: true, message: '必填,1-10位字符',min:1,max:10, trigger:'blur',type:'string'}" >
          <Input v-model="modalForm.TaskName" ></Input>
        </Form-item>
        <Form-item label="用量监控" >
          <Radio disabled="true">流量监控</Radio>
        </Form-item>
      </Row>
      <Row style="padding-left:30px;border-top:1px solid #e4e4e4">
        <div style="margin-left:-30px;padding:10px 0 25px;">定义触发条件和动作</div>
        <Form-item label="流量剩余下限比例"  >
          <Select v-model="modalForm.lowerLimit" placeholder="请选择">
            <Option  >40</Option>
            <Option  >80</Option>
            <Option  >100</Option>
          </Select>
          <Row style="padding:10px 0">
            <Checkbox v-model="modalForm.isEmail">发送邮箱至</Checkbox>
            <Input :disabled="!modalForm.isEmail" v-model="modalForm.Email" style="width:300px;" placeholder="多个邮箱请以逗号隔开"></Input>
          </Row>
          <Row style="padding:10px 0">
            <Checkbox v-model="modalForm.isSMS">发送短信至</Checkbox>
            <Input :disabled="!modalForm.isSMS" v-model="modalForm.SMS" style="width:300px;" placeholder="多个号码请以逗号隔开"></Input>
          </Row>

        </Form-item>
      </Row>
      <Row style="padding-left:30px;border-top:1px solid #e4e4e4">
        <div style="margin-left:-30px;padding:10px 0 25px;">定义触发范围</div>
        <Form-item label="选择卡"  >
            <Button type="primary" size="large" icon="ios-cloud-upload-outline" @click="chooseSimCard">选择SIM卡</Button>
        </Form-item>
        <Form-item label="卡号"  >
           <Input v-model="modalForm.simNums" :readonly="true" type="textarea" :rows="4" placeholder="请输入sim卡号"></Input>
        </Form-item>

      </Row>
      <Row style="padding-left:30px;border-top:1px solid #e4e4e4">
        <div style="margin-left:-30px;padding:10px 0 25px;">&nbsp</div>
        <Form-item label="备注"  >
          <Input v-model="modalForm.Remark" type="textarea" :rows="3" placeholder="请输入备注"></Input>
        </Form-item>

      </Row>

    </Form>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
    </div>
  </Modal>
  <simTransfer :modalShow="IsTransferShow"
               @listenModalForm="hideTransferModel"
               @emiteSimNums = "getTransferSimNums"></simTransfer>
</div>

</template>

<script>
import {addTask} from './../../../api/getData'
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
              TaskName: '',
              TaskType: '',
              Cus_CustomerId:'',
              Email:'',
              isEmail:false,
              SMS:'',
              isSMS:false,
              lowerLimit:'',
              simNums:'',
              Status:1,
              Remark:'',
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '创建任务',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
          },
          modalForm_loading:false,
          IsTransferShow:false,
        }
    },
    computed:{

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
      chooseSimCard(){
        this.IsTransferShow=true;
      },
      hideTransferModel(){
        this.IsTransferShow = false;
      },
      getTransferSimNums(simArr){
          this.modalForm.simNums = simArr.join(',')
      },
      saveForm(name) {
        this.$refs[name].validate( async (valid) => {
          if (valid) {
            this.modalForm_loading=true;
            const params = this.modalForm;
            try{
              let result = await addTask(params);
             // if (this.modalFormTitle ==='创建任务'){
              //   result = await addTask(params);
             // }
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
    }
}

</script>
