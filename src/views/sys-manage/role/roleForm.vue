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
      <Form-item label="角色名称" prop="RoleName" :rules="{required: true, message: '必填',min:1,max:10, trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.RoleName" ></Input>
      </Form-item>
      <Form-item label="人员类型"  >
        <Select v-model="modalForm.RoleNum" placeholder="请选择">
          <Option v-for="item in RoleNoCombo" :value="item.key" :key="item.key">{{ item.value }}</Option>
        </Select>
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
import {addRole,editRole} from './../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            RoleName: '',
            RoleNum: '',
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '添加功能',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
            Id:'',
            RoleName: '',
            RoleNum: '',
          },
          modalForm_loading:false,
          RoleNoCombo:[{key:1,value:'管理员'},{key:2,value:'普通用户'}]
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
      }
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
              if (this.modalFormTitle ==='添加功能'){
                 result = await addRole(params);
              }else{
                 result = await editRole(params);
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
