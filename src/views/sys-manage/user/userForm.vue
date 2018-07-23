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
      <Form-item label="用户名称" prop="UserName" :rules="{required: true, message: '必填,1-10位字符',min:1,max:10, trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.UserName" ></Input>
      </Form-item>
      <Form-item label="登录名" prop="LoginName" :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.LoginName" ></Input>
      </Form-item>
      <Form-item v-if="modalFormTitle==='添加用户'" label="密码" prop="Password"  :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.Password" type="password"></Input>
      </Form-item>
      <Form-item label="电话"  >
        <Input v-model="modalForm.Mobile" ></Input>
      </Form-item>
      <Form-item label="性别"  >
        <Select v-model="modalForm.Sex" placeholder="请选择">
          <Option v-for="item in SexCombo" :value="item.key" :key="item.key">{{ item.value }}</Option>
        </Select>
      </Form-item>
      <Form-item label="角色" prop="Sys_RoleId" :rules="{required: true, message: '必选', trigger:'change', type:'number'}"  >
        <Select v-model="modalForm.Sys_RoleId" placeholder="请选择" disabled>
          <Option v-for="item in roleComboList" :value="item.Id" :key="item.Id">{{ item.RoleName }}</Option>
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
import {addUser,editUser,roleComboList} from './../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            UserName: '',
            LoginName: '',
            Password:'',
            PhoneNum:'',
            Mobile:'',
            Sys_RoleId:0,
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
          },
          modalForm_loading:false,
          SexCombo:[{key:1,value:'男'},{key:2,value:'女'}],
          roleComboList:[{Id:1,RoleName:'管理员'}],
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
        if(this.modalFormTitle=='添加用户'){
          this.modalForm.Sys_RoleId=1;
        }
      }
    },
    created(){
      this.getRoleComboList();
    },
    mounted(){
    
    },
    methods: {
      async getRoleComboList(){
        this.roleComboList=await roleComboList();
      },
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
              if (this.modalFormTitle ==='添加用户'){
                 result = await addUser(params);
              }else{
                 result = await editUser(params);
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
