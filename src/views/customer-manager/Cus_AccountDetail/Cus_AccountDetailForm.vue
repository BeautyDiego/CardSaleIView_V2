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
      
      <Form-item label="充值金额" prop="BeforeCash" :rules="{required: true, message: '必填两位小数',min:0,max:1,  trigger:'blur',pattern:/^[1-9]\d*(.\d{1,2})?$ /}" >
        <Input v-model="modalForm.BeforeCash" ></Input>
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
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">充值</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {addCustomer} from './../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            Cus_Name: '',
            LoginName: '',
            Cus_Address: '',
            Industry: '',
            Region: '',
            ManagerName: '',
            ManagerEmail: '',
            ManagerMobile:'',
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
//        default: '添加用户',
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
              if (this.modalFormTitle ==='客户充值'){
//                 result = await addCustomer(params);
//              }else{
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
