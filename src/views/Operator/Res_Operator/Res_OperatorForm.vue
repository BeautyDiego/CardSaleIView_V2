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
      <Form-item label="运营商名称" prop="OperName" :rules="{required: true, message: '必填,1-50位字符',min:1,max:50,  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.OperName" ></Input>
      </Form-item>
      <Form-item label="运营商" prop="OperType" :rules="{required: true, message: '必填', trigger:'blur'}" >
        <RadioGroup v-model="modalForm.OperType" type="button" size="large" >
          <Radio label="中国电信"></Radio>
          <Radio label="中国移动"></Radio>
          <Radio label="中国联通"></Radio>
        </RadioGroup>
      </Form-item>
      <Form-item label="状态" prop="Enabled" :rules="{required: true, message: '必填', trigger:'blur'}" >
        <RadioGroup v-model="modalForm.Enabled" type="button" size="large" >
          <Radio label="生效"></Radio>
          <Radio label="注销"></Radio>
        </RadioGroup>
      </Form-item>
      <Form-item label="联系人名称" prop="ContactName" :rules="{required: true, message: '必填',  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.ContactName" ></Input>
      </Form-item>
      <Form-item label="联系人电话" prop="ComtactMobile" :rules="{required: true, message: '输入11位手机号', trigger:'blur',type:'string',pattern: /^1\d{10}$/}" >
        <Input v-model="modalForm.ComtactMobile" ></Input>
      </Form-item>
      <Form-item label="用户姓名" prop="UserName" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.UserName" ></Input>
      </Form-item>
      <Form-item label="用户密码" prop="UserPwd" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.UserPwd" ></Input>
      </Form-item>
      <Form-item label="运营商地址" prop="OperUrl" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.OperUrl" ></Input>
      </Form-item>
      <Form-item label="AppKEY" prop="AppKey" :rules="{required: true, message: '必填',  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.AppKey" ></Input>
      </Form-item>
      <Form-item label="AppSecret" prop="AppSecret" :rules="{required: true, message: '必填',  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.AppSecret" ></Input>
      </Form-item>
      <Form-item label="IP端口" prop="IPAndPort" :rules="{required: true, message: '必填',  trigger:'blur',type:'string'}" >
      <Input v-model="modalForm.IPAndPort" ></Input>
    </Form-item>
      <Form-item label="集团编码" prop="GroupCode" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.GroupCode" ></Input>
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
import {addResOperator,editResOperator} from '../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            OperName: '',
            OperType: '1',
            ContactName: '',
            ComtactMobile: '',
              AppKey: '',
            UserName: '',
            UserPwd: '',
            Enabled:'1',
              IPAndPort:'',
              OperUrl:'',
              AppSecret:'',
              IPAndPort:'',
              GroupCode:'',

          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '添加运营商',
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
              if (this.modalFormTitle ==='添加运营商'){
                 result = await addResOperator(params);
              }else{
                 result = await editResOperator(params);
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
