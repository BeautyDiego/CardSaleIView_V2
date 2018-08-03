<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="600">
    <Form ref="modalForm" :model="modalForm" :label-width="110"  value=true  style="padding: 3px 30px">
      <Row>
        <Form-item label="阶段" prop="Stage" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
          <InputNumber v-model="modalForm.Stage" :precision=0 style="width:200px"></InputNumber>
        </Form-item>
      </Row>
      <Row>
        <Col span="12">
          <Form-item label="SIM卡最小数量" prop="MinSimCount" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
            <InputNumber v-model="modalForm.MinSimCount" :precision=0></InputNumber>&nbsp个
          </Form-item>
        </Col>
        <Col span="12">
          <Form-item label="SIM卡最大数量" prop="MaxSimCount" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
            <InputNumber v-model="modalForm.MaxSimCount" :precision=0></InputNumber>&nbsp个
          </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <Form-item label="最小流量" prop="MinFlowCount" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
            <InputNumber v-model="modalForm.MinFlowCount" :precision=0></InputNumber> &nbsp GB
          </Form-item>
        </Col>
        <Col span="12">
          <Form-item label="最大流量" prop="MaxFlowCount" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
            <InputNumber v-model="modalForm.MaxFlowCount" :precision=0></InputNumber>&nbspGB
          </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <Form-item label="购买单价" prop="SinglePrice" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
            <InputNumber v-model="modalForm.SinglePrice" ></InputNumber>&nbsp￥/GB
          </Form-item>
        </Col>
        <Col span="12">
          <Form-item label="续费单价" prop="ChargePrice" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
            <InputNumber v-model="modalForm.ChargePrice" ></InputNumber>&nbsp￥/GB
          </Form-item>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <Form-item label="原单价" prop="OriginalPrice" :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
          <InputNumber v-model="modalForm.OriginalPrice" ></InputNumber>&nbsp￥/GB
        </Form-item>
        </Col>
        <Col span="12">
      
        </Col>
      </Row>
      <Row>
        <Form-item label="备注"  >
          <Input v-model="modalForm.Remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width:300px"></Input>
        </Form-item>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {addSimExpanseConfig,editSimExpanseConfig} from '../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            Stage: '',
            MinSimCount:0,
            MaxSimCount:0,
            MinFlowCount:0,
            MaxFlowCount:0,
            SinglePrice:0,
            ChargePrice:0,
            OriginalPrice:0,
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
        default: '添加资费配置',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
          },
          modalForm_loading:false,
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
              if (this.modalFormTitle ==='添加资费配置'){
                 result = await addSimExpanseConfig(params);
              }else{
                 result = await editSimExpanseConfig(params);
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
    }
}

</script>
