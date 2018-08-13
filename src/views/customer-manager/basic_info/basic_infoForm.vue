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
    <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 3px 60px">
      <Form-item label="客户名称" prop="Cus_Name" :rules="{required: true, message: '必填,1-50位字符',min:1,max:50,  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.Cus_Name" ></Input>
      </Form-item>
      <Form-item label="登录名" prop="LoginName" :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.LoginName" ></Input>
      </Form-item>
      <Form-item v-if="modalFormTitle==='添加客户'" label="密码" prop="Password"  :rules="{required: true, message: '必填,6-16位数字或字母或-_', trigger:'blur',type:'string',pattern: /^[a-zA-Z0-9_-]{6,16}$/}" >
        <Input v-model="modalForm.Password" type="password"></Input>
      </Form-item>
      <Form-item label="所属企业" prop="Company" :rules="{required: true, message: '必填,1-50位字符',min:1,max:50,  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.Company" ></Input>
      </Form-item>
      <Form-item label="地址"  >
        <Input v-model="modalForm.Cus_Address" ></Input>
      </Form-item>
      <Form-item label="行业"  >
        <Input v-model="modalForm.Industry" ></Input>
      </Form-item>
      <Form-item label="区域"  >
        <Input v-model="modalForm.Region" ></Input>
      </Form-item>
      <Form-item label="负责人姓名" prop="ManagerName" :rules="{required: true, message: '必填,1-10位字符',min:1,max:10,  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.ManagerName" ></Input>
      </Form-item>
      <Form-item label="负责人手机" prop="ManagerMobile" :rules="{required: true, message: '输入11位手机号', trigger:'blur',type:'string',pattern: /^1\d{10}$/}" >
        <Input v-model="modalForm.ManagerMobile" ></Input>
      </Form-item>
      <Form-item label="负责人邮箱" prop="ManagerEmail" :rules="{required: true, message: '输入正确邮箱', trigger:'blur',type:'string',pattern:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/}"  >
        <Input v-model="modalForm.ManagerEmail" ></Input>
      </Form-item>
      <Form-item label="邮箱KEY"  >
        <Input v-model="modalForm.ManagerEmailKey" ></Input>
      </Form-item>
      <Form-item label="备注"  >
        <Input type="textarea" v-model="modalForm.Remark" :rows="2" :maxlength="100"></Input>
      </Form-item>
      <!--<Form-item label="性别"  >-->
        <!--<Select v-model="modalForm.Sex" placeholder="请选择">-->
          <!--<Option v-for="item in SexCombo" :value="item.key" :key="item.key">{{ item.value }}</Option>-->
        <!--</Select>-->
      <!--</Form-item>-->
      <!--<Form-item label="角色" prop="Rbac_RoleId" :rules="{required: true, message: '必填', trigger:'change',type:'number'}"  >-->
        <!--<Select v-model="modalForm.Sys_RoleId" placeholder="请选择">-->
          <!--<Option v-for="item in roleComboList" :value="item.Id" :key="item.Id">{{ item.RoleName }}</Option>-->
        <!--</Select>-->
      <!--</Form-item>-->
    </Form>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {addCustomer,editCustomer} from './../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            Cus_Name: '',
            LoginName: '',
            Company:'',
            Cus_Address: '',
            Industry: '',
            Region: '',
            ManagerName: '',
            ManagerEmail: '',
            ManagerMobile:'',
            ManagerEmailKey:'',
            Remark:'',
            Discount:''
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
          modalForm_loading:false
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
      }
    },
    created(){
     // this.getRoleComboList();
    },
    mounted(){
    
    },
    methods: {
//      async getRoleComboList(){
//        this.roleComboList=await roleComboList();
//        console.log(this.roleComboList)
//      },
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
              if (this.modalFormTitle ==='添加客户'){
                 result = await addCustomer(params);
              }else{
                 result = await editCustomer(params);
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
