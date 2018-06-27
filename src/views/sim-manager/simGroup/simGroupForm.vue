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
      <Form ref="modalForm" :model="modalForm" :label-width="80"  value=true  style="padding: 3px 60px">
        <Form-item label="SIM卡组名" prop="GroupName" :rules="{required: true, message: '必填,1到20位字符',min:1,max:20, trigger:'blur',type:'string'}" >
          <Input v-model="modalForm.GroupName" ></Input>
        </Form-item>
        <Form-item label="组描述" prop="GroupDescribe" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
          <Input v-model="modalForm.GroupDescribe" ></Input>
        </Form-item>
        <Form-item label="备注" >
          <Input type="textarea" v-model="modalForm.Remark" ></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="cancel" >取消</Button>
        <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {addSimGroup,editSimGroup} from './../../../api/getData'
  import { mapState } from 'vuex'
  export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            GroupName: '',
            GroupDescribe: '',
            OwerType:'',
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
        default: '添加SIM卡组',
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
    computed: {
      ...mapState({
        adminInfo: state => state.user.adminInfo,
      }),
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
            let params = this.modalForm;
            try{
              let result;
              if (this.modalFormTitle ==='添加SIM卡组'){
                params.OwerType = this.adminInfo.OwerType
                result = await addSimGroup(params);
              }else{
                result = await editSimGroup(params);
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
